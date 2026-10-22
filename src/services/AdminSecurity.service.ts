import bcrypt from "bcryptjs";
import { authenticator } from "otplib";
import QRCode from "qrcode";
import MemberModel from "../models/Member.model";
import { Member } from "../libs/types/member";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";
import Errors, { HTTPCode, Message } from "../libs/Errors";
import { shapeIntoMongooseObjectId } from "../libs/config";
import { decryptSecret, encryptSecret } from "../libs/crypto";
import { cache } from "../libs/cache";

// accept the previous/next 30-second code too (phone clocks drift)
authenticator.options = { window: 1 };

const ISSUER = "KIXORA Admin";
const BCRYPT_ROUNDS = 10;

type AdminRow = Pick<Member, "_id" | "memberNick" | "memberPhone" | "memberStatus" | "createdAt"> & { adminTotpEnabled?: boolean };

/** Admin accounts: TOTP two-factor login and managing several admins */
class AdminSecurityService {
  private readonly memberModel = MemberModel;

  private async getAdmin(id: string) {
    const admin = await this.memberModel
      .findOne({ _id: shapeIntoMongooseObjectId(id), memberType: MemberType.RESTAURANT })
      .select("+adminTotpSecret memberNick adminTotpEnabled memberStatus")
      .exec();
    if (!admin) throw new Errors(HTTPCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return admin;
  }

  public async isTotpEnabled(adminId: string): Promise<boolean> {
    const admin = await this.memberModel.findById(shapeIntoMongooseObjectId(adminId)).select("adminTotpEnabled").lean<{ adminTotpEnabled?: boolean }>().exec();
    return Boolean(admin?.adminTotpEnabled);
  }

  /** Step 1 of enrolling: a new secret (kept in the session until confirmed) + QR code */
  public async startTotpSetup(adminNick: string) {
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(adminNick, ISSUER, secret);
    return { secret, qrDataUrl: await QRCode.toDataURL(otpauth) };
  }

  /** Step 2: the admin proves the authenticator app works, then 2FA is switched on */
  public async confirmTotpSetup(adminId: string, secret: string, code: string): Promise<void> {
    if (!authenticator.check(code, secret)) throw new Errors(HTTPCode.BAD_REQUEST, Message.INVALID_2FA_CODE);
    await this.memberModel
      .updateOne(
        { _id: shapeIntoMongooseObjectId(adminId), memberType: MemberType.RESTAURANT },
        { $set: { adminTotpSecret: encryptSecret(secret), adminTotpEnabled: true } }
      )
      .exec();
  }

  public async verifyTotp(adminId: string, code: string): Promise<boolean> {
    const admin = await this.getAdmin(adminId);
    const sealed = admin.get("adminTotpSecret") as string | undefined;
    if (!admin.get("adminTotpEnabled") || !sealed) return false;
    return authenticator.check(code, decryptSecret(sealed));
  }

  /** Turning 2FA off requires a current code, so a hijacked session alone can't do it */
  public async disableTotp(adminId: string, code: string): Promise<void> {
    if (!(await this.verifyTotp(adminId, code))) throw new Errors(HTTPCode.BAD_REQUEST, Message.INVALID_2FA_CODE);
    await this.memberModel
      .updateOne({ _id: shapeIntoMongooseObjectId(adminId) }, { $set: { adminTotpEnabled: false }, $unset: { adminTotpSecret: 1 } })
      .exec();
  }

  // ---------- Several admins ----------
  public async listAdmins(): Promise<AdminRow[]> {
    return this.memberModel
      .find({ memberType: MemberType.RESTAURANT })
      .select("memberNick memberPhone memberStatus createdAt adminTotpEnabled")
      .sort({ createdAt: 1 })
      .lean<AdminRow[]>()
      .exec();
  }

  public async createAdmin(input: { memberNick: string; memberPhone: string; memberPassword: string }) {
    try {
      const admin = await this.memberModel.create({
        memberNick: input.memberNick,
        memberPhone: input.memberPhone,
        memberPassword: await bcrypt.hash(input.memberPassword, BCRYPT_ROUNDS),
        memberType: MemberType.RESTAURANT,
        memberStatus: MemberStatus.ACTIVE,
      });
      return { _id: String(admin._id), memberNick: admin.memberNick };
    } catch (err: any) {
      if (err?.code === 11000) throw new Errors(HTTPCode.CONFLICT, Message.USED_NICK_PHONE);
      throw err;
    }
  }

  /** Activate/deactivate another admin. You can't lock yourself out, nor remove the last active admin. */
  public async setAdminStatus(actingAdminId: string, targetId: string, status: MemberStatus.ACTIVE | MemberStatus.BLOCK) {
    if (actingAdminId === targetId) throw new Errors(HTTPCode.BAD_REQUEST, Message.CANNOT_CHANGE_SELF);
    if (status === MemberStatus.BLOCK) {
      const activeAdmins = await this.memberModel
        .countDocuments({ memberType: MemberType.RESTAURANT, memberStatus: MemberStatus.ACTIVE, _id: { $ne: shapeIntoMongooseObjectId(targetId) } })
        .exec();
      if (activeAdmins < 1) throw new Errors(HTTPCode.BAD_REQUEST, Message.LAST_ADMIN);
    }
    const res = await this.memberModel
      .updateOne({ _id: shapeIntoMongooseObjectId(targetId), memberType: MemberType.RESTAURANT }, { $set: { memberStatus: status } })
      .exec();
    if (!res.matchedCount) throw new Errors(HTTPCode.NOT_FOUND, Message.NO_DATA_FOUND);
    await cache.del(`member:status:${targetId}`); // takes effect on their next request
  }
}

export default AdminSecurityService;
