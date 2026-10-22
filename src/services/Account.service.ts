import crypto from "crypto";
import bcrypt from "bcryptjs";
import AccountTokenModel from "../models/AccountToken.model";
import MemberModel from "../models/Member.model";
import { Member } from "../libs/types/member";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";
import Errors, { HTTPCode, Message } from "../libs/Errors";
import { env, shapeIntoMongooseObjectId } from "../libs/config";
import { mailer } from "../libs/mailer";
import { cache } from "../libs/cache";
import { logger } from "../libs/logger";

type TokenType = "RESET";

const RESET_TTL_MINUTES = 30;
const BCRYPT_ROUNDS = 10;

const hashToken = (token: string) => crypto.createHash("sha256").update(token).digest("hex");

/** Password reset with one-time, expiring, hashed tokens */
class AccountService {
  private readonly tokenModel = AccountTokenModel;
  private readonly memberModel = MemberModel;

  /** Creates a new token (older unused tokens of the same type stop working) */
  private async issueToken(memberId: unknown, type: TokenType, ttlMs: number): Promise<string> {
    await this.tokenModel.deleteMany({ memberId, type, usedAt: null }).exec();
    const token = crypto.randomBytes(32).toString("hex");
    await this.tokenModel.create({ memberId, type, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + ttlMs) });
    return token;
  }

  /** Marks a valid token as used and returns its member id (single use, atomic) */
  private async consumeToken(token: string, type: TokenType) {
    const doc = await this.tokenModel
      .findOneAndUpdate(
        { tokenHash: hashToken(token), type, usedAt: null, expiresAt: { $gt: new Date() } },
        { $set: { usedAt: new Date() } },
        { new: true }
      )
      .lean<{ memberId: unknown }>()
      .exec();
    if (!doc) throw new Errors(HTTPCode.BAD_REQUEST, Message.INVALID_TOKEN);
    return doc.memberId;
  }

  /**
   * Always answers the same way, whether or not the email exists, so the form
   * can't be used to find out who has an account.
   */
  public async requestPasswordReset(email: string): Promise<{ sent: true }> {
    const member = await this.memberModel
      .findOne({ memberEmail: email, memberType: MemberType.USER, memberStatus: MemberStatus.ACTIVE })
      .select("_id memberNick")
      .lean<Pick<Member, "_id" | "memberNick">>()
      .exec();
    if (member) {
      const token = await this.issueToken(member._id, "RESET", RESET_TTL_MINUTES * 60 * 1000);
      await mailer
        .send({
          to: email,
          subject: "Reset your KIXORA password",
          text:
            `Hi ${member.memberNick},\n\nUse this link to choose a new password (valid for ${RESET_TTL_MINUTES} minutes):\n` +
            `${env.appUrl}/reset-password?token=${token}\n\nIf you didn't ask for this, you can ignore this email.`,
        })
        .catch((err) => logger.error("Password reset email failed", { err }));
    }
    return { sent: true };
  }

  /** Sets the new password and signs the member out everywhere (older JWTs are rejected) */
  public async resetPassword(token: string, newPassword: string): Promise<{ reset: true }> {
    const memberId = await this.consumeToken(token, "RESET");
    await this.memberModel
      .updateOne(
        { _id: memberId },
        {
          $set: {
            memberPassword: await bcrypt.hash(newPassword, BCRYPT_ROUNDS),
            // JWT "iat" has 1-second precision; tokens from earlier seconds are rejected
            passwordChangedAt: new Date(),
          },
        }
      )
      .exec();
    await this.tokenModel.deleteMany({ memberId, type: "RESET" }).exec();
    await cache.del(`member:status:${String(memberId)}`);
    return { reset: true };
  }

}

export default AccountService;
