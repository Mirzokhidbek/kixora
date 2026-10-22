import MemberModel from "../models/Member.model";
import { Member, GoogleAuthInput, AuthPayload } from "../libs/types/member";
import Errors, { HTTPCode, Message } from "../libs/Errors";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { escapeRegex, shapeIntoMongooseObjectId } from "../libs/config";
import { cache } from "../libs/cache";
import { z } from "zod";
import {
  adminLoginSchema,
  adminSignupSchema,
  adminUserUpdateSchema,
  loginSchema,
  memberUpdateSchema,
  signupSchema,
} from "../libs/validation";

type SignupInput = z.infer<typeof signupSchema>;
type LoginInput = z.infer<typeof loginSchema>;
type MemberUpdate = z.infer<typeof memberUpdateSchema> & { memberImage?: string };
type AdminSignupInput = z.infer<typeof adminSignupSchema> & { memberImage?: string };
type AdminLoginInput = z.infer<typeof adminLoginSchema>;
type AdminUserUpdate = z.infer<typeof adminUserUpdateSchema>;

const BCRYPT_ROUNDS = 10;

/** Removes the password hash from any member object before it leaves the service */
function stripPassword<T extends { memberPassword?: string }>(member: T): T {
  const { memberPassword: _omit, ...rest } = member;
  return rest as T;
}

function isDuplicateKeyError(err: unknown): err is { code: number; keyPattern?: Record<string, number> } {
  return typeof err === "object" && err !== null && (err as { code?: number }).code === 11000;
}

class MemberService {
  private readonly memberModel = MemberModel;

  /** SPA: Get Active Store (admin) public profile **/
  public async getRestaurant(): Promise<Member> {
    const result = await this.memberModel
      .findOne({ memberType: MemberType.RESTAURANT, memberStatus: MemberStatus.ACTIVE })
      .sort({ createdAt: 1 }) // the store owner = first admin (there may be several)
      .select("memberNick memberPhone memberAddress memberDesc memberImage")
      .lean<Member>()
      .exec();
    if (!result) throw new Errors(HTTPCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  /** SPA SIGNUP (USER) — memberType/status/points are never taken from input **/
  public async signup(input: SignupInput): Promise<Member> {
    const memberPassword = await bcrypt.hash(input.memberPassword, BCRYPT_ROUNDS);
    try {
      const result = await this.memberModel.create({
        memberNick: input.memberNick,
        memberEmail: input.memberEmail,
        memberPhone: input.memberPhone || undefined,
        memberPassword,
        memberType: MemberType.USER,
        memberStatus: MemberStatus.ACTIVE,
      });
      return stripPassword(result.toObject() as Member);
    } catch (err: unknown) {
      if (isDuplicateKeyError(err)) {
        const field = Object.keys(err.keyPattern || {})[0];
        throw new Errors(
          HTTPCode.CONFLICT,
          field === "memberEmail" ? Message.USED_EMAIL : Message.USED_NICK_PHONE
        );
      }
      throw err;
    }
  }

  /** SPA LOGIN (USER) - Supports Email, Nickname or Phone **/
  public async login(input: LoginInput): Promise<Member> {
    const identifier = (input.memberEmail || input.memberNick || "").trim();
    const member = await this.memberModel
      .findOne({
        $or: [
          { memberEmail: identifier.toLowerCase() },
          { memberNick: identifier },
          { memberPhone: identifier },
        ],
        memberType: MemberType.USER,
        memberStatus: { $ne: MemberStatus.DELETE },
      })
      .select("+memberPassword")
      .lean<Member>()
      .exec();

    // Same message for unknown user and wrong password (no account enumeration)
    const isMatch = member
      ? await bcrypt.compare(input.memberPassword, member.memberPassword || "")
      : false;
    if (!member || !isMatch) {
      throw new Errors(HTTPCode.UNAUTHORIZED, Message.WRONG_CREDENTIALS);
    }
    if (member.memberStatus === MemberStatus.BLOCK) {
      throw new Errors(HTTPCode.FORBIDDEN, Message.BLOCKED_USER);
    }
    return stripPassword(member);
  }

  /** SPA: GOOGLE LOGIN / SIGNUP — input MUST come from a verified identity token **/
  public async googleLogin(googleData: GoogleAuthInput): Promise<Member> {
    const member = await this.memberModel
      .findOne({
        $or: [{ googleId: googleData.googleId }, { memberEmail: googleData.email }],
        memberStatus: { $ne: MemberStatus.DELETE },
      })
      .exec();

    if (member) {
      if (member.memberType !== MemberType.USER) {
        throw new Errors(HTTPCode.FORBIDDEN, Message.NOT_AUTHORIZED);
      }
      if (member.memberStatus === MemberStatus.BLOCK) {
        throw new Errors(HTTPCode.FORBIDDEN, Message.BLOCKED_USER);
      }
      let changed = false;
      if (!member.googleId) {
        member.googleId = googleData.googleId; // link verified Google identity
        changed = true;
      }
      if (googleData.picture && !member.memberImage) {
        member.memberImage = googleData.picture;
        changed = true;
      }
      if (changed) await member.save();
      return stripPassword(member.toObject() as Member);
    }

    const baseNick =
      googleData.name.replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 30) ||
      googleData.email.split("@")[0];
    const taken = await this.memberModel
      .find({ memberNick: { $regex: `^${escapeRegex(baseNick)}(_\\d+)?$` } })
      .select("memberNick")
      .lean<{ memberNick: string }[]>()
      .exec();
    const takenSet = new Set(taken.map((m) => m.memberNick));
    let uniqueNick = baseNick;
    for (let i = 1; takenSet.has(uniqueNick); i++) uniqueNick = `${baseNick}_${i}`;

    // Google accounts sign in via Google only; the password is random and never revealed
    const memberPassword = await bcrypt.hash(crypto.randomBytes(32).toString("hex"), BCRYPT_ROUNDS);
    const create = (memberNick: string) => this.memberModel.create({
      memberType: MemberType.USER,
      memberStatus: MemberStatus.ACTIVE,
      memberNick,
      memberEmail: googleData.email,
      memberPassword,
      memberImage: googleData.picture || "",
      googleId: googleData.googleId,
    });
    // Another sign-up may take the same nick between the check and the insert:
    // the unique index rejects it, so retry once with a random suffix.
    const newMember = await create(uniqueNick).catch((err) => {
      if (!isDuplicateKeyError(err) || !(err.keyPattern && "memberNick" in err.keyPattern)) throw err;
      return create(`${baseNick}_${crypto.randomBytes(2).toString("hex")}`);
    });
    return stripPassword(newMember.toObject() as Member);
  }

  /** SPA: Get Authenticated User Details **/
  public async getMemberDetail(member: AuthPayload): Promise<Member> {
    const result = await this.memberModel
      .findOne({ _id: shapeIntoMongooseObjectId(member._id), memberStatus: MemberStatus.ACTIVE })
      .lean<Member>()
      .exec();
    if (!result) throw new Errors(HTTPCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  /** SPA: Update Member Profile (whitelisted fields only) **/
  public async updateMember(member: AuthPayload, input: MemberUpdate): Promise<Member> {
    try {
      const result = await this.memberModel
        .findOneAndUpdate(
          { _id: shapeIntoMongooseObjectId(member._id), memberStatus: MemberStatus.ACTIVE },
          { $set: input },
          { new: true, runValidators: true }
        )
        .lean<Member>()
        .exec();
      if (!result) throw new Errors(HTTPCode.NOT_FOUND, Message.UPDATE_FAILED);
      return result;
    } catch (err) {
      if (isDuplicateKeyError(err)) throw new Errors(HTTPCode.CONFLICT, Message.USED_NICK_PHONE);
      throw err;
    }
  }

  /** SPA: Get Top Users by Loyalty Points (public fields only) **/
  public async getTopUsers(): Promise<Member[]> {
    return this.memberModel
      .find({ memberType: MemberType.USER, memberStatus: MemberStatus.ACTIVE, memberPoints: { $gte: 1 } })
      .select("memberNick memberImage memberPoints")
      .sort({ memberPoints: -1 })
      .limit(4)
      .lean<Member[]>()
      .exec();
  }

  /** BSSR SIGNUP (ADMIN) — only possible while no admin exists **/
  public async processSignup(input: AdminSignupInput): Promise<Member> {
    const exist = await this.memberModel.exists({ memberType: MemberType.RESTAURANT });
    if (exist) throw new Errors(HTTPCode.FORBIDDEN, Message.ADMIN_EXISTS);

    try {
      const result = await this.memberModel.create({
        memberNick: input.memberNick,
        memberPhone: input.memberPhone,
        memberImage: input.memberImage,
        memberPassword: await bcrypt.hash(input.memberPassword, BCRYPT_ROUNDS),
        memberType: MemberType.RESTAURANT,
        memberStatus: MemberStatus.ACTIVE,
      });
      return stripPassword(result.toObject() as Member);
    } catch (err) {
      if (isDuplicateKeyError(err)) throw new Errors(HTTPCode.CONFLICT, Message.USED_NICK_PHONE);
      throw err;
    }
  }

  /** BSSR LOGIN (ADMIN) — only RESTAURANT accounts may log in here **/
  public async processLogin(input: AdminLoginInput): Promise<Member> {
    const member = await this.memberModel
      .findOne({
        memberNick: input.memberNick,
        memberType: MemberType.RESTAURANT,
        memberStatus: MemberStatus.ACTIVE,
      })
      .select("+memberPassword")
      .lean<Member>()
      .exec();

    const isMatch = member
      ? await bcrypt.compare(input.memberPassword, member.memberPassword || "")
      : false;
    if (!member || !isMatch) throw new Errors(HTTPCode.UNAUTHORIZED, Message.WRONG_CREDENTIALS);
    return stripPassword(member);
  }

  /** BSSR: admin account after the 2FA step (must still be an active admin) */
  public async getAdminForSession(adminId: string): Promise<Member> {
    const member = await this.memberModel
      .findOne({ _id: shapeIntoMongooseObjectId(adminId), memberType: MemberType.RESTAURANT, memberStatus: MemberStatus.ACTIVE })
      .lean<Member>()
      .exec();
    if (!member) throw new Errors(HTTPCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);
    return member;
  }

  /** BSSR: Paginated user list for admin **/
  public async getUsers(page: number, limit: number): Promise<{ users: Member[]; total: number }> {
    const filter = { memberType: MemberType.USER };
    const [users, total] = await Promise.all([
      this.memberModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<Member[]>()
        .exec(),
      this.memberModel.countDocuments(filter).exec(),
    ]);
    return { users, total };
  }

  public async countUsers(): Promise<number> {
    return this.memberModel.countDocuments({ memberType: MemberType.USER }).exec();
  }

  /** BSSR: Admin may change a USER's status only (never another admin, never roles) **/
  public async updateChosenUser(input: AdminUserUpdate): Promise<Member> {
    const result = await this.memberModel
      .findOneAndUpdate(
        { _id: shapeIntoMongooseObjectId(input._id), memberType: MemberType.USER },
        { $set: { memberStatus: input.memberStatus } },
        { new: true }
      )
      .lean<Member>()
      .exec();
    if (!result) throw new Errors(HTTPCode.NOT_FOUND, Message.UPDATE_FAILED);
    // takes effect on the member's very next request (see middlewares/auth.ts)
    await cache.del(`member:status:${String(result._id)}`);
    return result;
  }

  /** BSSR: Update Member Loyalty Reward Points by Admin **/
  public async updateMemberPointsByAdmin(id: string, points: number): Promise<Member> {
    const result = await this.memberModel
      .findOneAndUpdate(
        { _id: shapeIntoMongooseObjectId(id), memberType: MemberType.USER },
        { $set: { memberPoints: points } },
        { new: true }
      )
      .lean<Member>()
      .exec();
    if (!result) throw new Errors(HTTPCode.NOT_FOUND, Message.UPDATE_FAILED);
    return result;
  }
}

export default MemberService;
