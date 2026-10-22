import MemberModel from "../schema/Member.model";
import {
  Member,
  MemberInput,
  LoginInput,
  MemberUpdateInput,
  GoogleAuthInput,
} from "../libs/types/member";
import Errors, { HTTPCode, Message } from "../libs/Errors";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";
import bcrypt from "bcryptjs";
import { shapeIntoMongooseObjectId } from "../libs/config";

class MemberService {
  private readonly memberModel;

  constructor() {
    this.memberModel = MemberModel;
  }

  /** SPA: Get Active Restaurant Details with Lean Query **/
  public async getRestaurant(): Promise<Member> {
    const result = await this.memberModel
      .findOne({
        memberType: MemberType.RESTAURANT,
        memberStatus: MemberStatus.ACTIVE,
      })
      .lean<Member>()
      .exec();
    if (!result) throw new Errors(HTTPCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  /** SPA SIGNUP (USER) **/
  public async signup(input: MemberInput): Promise<Member> {
    const salt = await bcrypt.genSalt();
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt);

    if (input.memberEmail) {
      input.memberEmail = input.memberEmail.toLowerCase().trim();
    }
    if (!input.memberPhone) {
      input.memberPhone = input.memberEmail || `+998${Date.now()}`;
    }

    try {
      const result = await this.memberModel.create(input);
      result.memberPassword = "";
      return result.toObject() as Member;
    } catch (err: unknown) {
      console.error("Error, signup:", err);
      if (typeof err === 'object' && err !== null && 'code' in err && (err as { code: number }).code === 11000) {
        throw new Errors(HTTPCode.BAD_REQUEST, "Email already registered. Please sign in.");
      }
      throw new Errors(HTTPCode.BAD_REQUEST, Message.USED_NICK_PHONE);
    }
  }

  /** SPA LOGIN (USER) - Supports Email, Nickname or Phone **/
  public async login(input: LoginInput): Promise<Member> {
    const identifier = (input.memberEmail || input.memberNick || "").trim();
    if (!identifier) {
      throw new Errors(HTTPCode.BAD_REQUEST, Message.NO_DATA_FOUND);
    }

    const member = await this.memberModel
      .findOne(
        {
          $or: [
            { memberEmail: identifier.toLowerCase() },
            { memberNick: identifier },
            { memberPhone: identifier },
          ],
          memberStatus: { $ne: MemberStatus.DELETE },
        },
        { memberNick: 1, memberEmail: 1, memberPhone: 1, memberPassword: 1, memberStatus: 1 }
      )
      .lean<Member>()
      .exec();

    if (!member) throw new Errors(HTTPCode.NOT_FOUND, Message.NO_MEMBER_NICK);
    else if (member.memberStatus === MemberStatus.BLOCK) {
      throw new Errors(HTTPCode.FORBIDDEN, Message.BLOCKED_USER);
    }

    const isMatch = await bcrypt.compare(
      input.memberPassword,
      member.memberPassword || ""
    );
    if (!isMatch) {
      throw new Errors(HTTPCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
    }

    const result = await this.memberModel.findById(member._id).lean<Member>().exec();
    if (!result) throw new Errors(HTTPCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  /** SPA: GOOGLE OAUTH LOGIN / SIGNUP **/
  public async googleLogin(googleData: GoogleAuthInput): Promise<Member> {
    let member = await this.memberModel
      .findOne({
        $or: [
          { googleId: googleData.googleId },
          { memberEmail: googleData.email },
        ],
        memberStatus: { $ne: MemberStatus.DELETE },
      })
      .exec();

    if (member) {
      if (member.memberStatus === MemberStatus.BLOCK) {
        throw new Errors(HTTPCode.FORBIDDEN, Message.BLOCKED_USER);
      }
      if (googleData.picture && !member.memberImage) {
        member.memberImage = googleData.picture;
        await member.save();
      }
      return member.toObject() as Member;
    }

    // Generate unique nick
    const cleanName = googleData.name ? googleData.name.replace(/[^a-zA-Z0-9_]/g, "_") : googleData.email.split("@")[0];
    let uniqueNick = cleanName;
    let counter = 1;
    while (await this.memberModel.findOne({ memberNick: uniqueNick })) {
      uniqueNick = `${cleanName}_${counter++}`;
    }

    const uniquePhone = `G_${googleData.googleId.slice(0, 10)}`;

    const newMember = await this.memberModel.create({
      memberType: MemberType.USER,
      memberStatus: MemberStatus.ACTIVE,
      memberNick: uniqueNick,
      memberPhone: uniquePhone,
      memberEmail: googleData.email,
      memberPassword: await bcrypt.hash(googleData.googleId, 10),
      memberImage: googleData.picture || "",
      googleId: googleData.googleId,
    });

    return newMember.toObject() as Member;
  }

  /** SPA: Get Authenticated User Details **/
  public async getMemberDetail(member: Member): Promise<Member> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const result = await this.memberModel
      .findOne({ _id: memberId, memberStatus: MemberStatus.ACTIVE })
      .lean<Member>()
      .exec();
    if (!result) throw new Errors(HTTPCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  /** SPA: Update Member Profile **/
  public async updateMember(
    member: Member,
    input: MemberUpdateInput
  ): Promise<Member> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const result = await this.memberModel
      .findOneAndUpdate({ _id: memberId }, input, { new: true })
      .lean<Member>()
      .exec();
    if (!result) throw new Errors(HTTPCode.NOT_MODIFIED, Message.UPDATE_FAILED);

    return result;
  }

  /** SPA: Get Top Users by Loyalty Points **/
  public async getTopUsers(): Promise<Member[]> {
    const result = await this.memberModel
      .find({
        memberStatus: MemberStatus.ACTIVE,
        memberPoints: { $gte: 1 },
      })
      .sort({ memberPoints: -1 })
      .limit(4)
      .lean<Member[]>()
      .exec();
    if (!result) throw new Errors(HTTPCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  /** BSSR SIGNUP (ADMIN) **/
  public async processSignup(input: MemberInput): Promise<Member> {
    const exist = await this.memberModel
      .findOne({ memberType: MemberType.RESTAURANT })
      .exec();
    if (exist) throw new Errors(HTTPCode.BAD_REQUEST, Message.CREATE_FAILED);

    const salt = await bcrypt.genSalt();
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt);

    try {
      const result = await this.memberModel.create(input);
      result.memberPassword = "";
      return result.toObject() as Member;
    } catch (err) {
      throw new Errors(HTTPCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  /** BSSR LOGIN (ADMIN) **/
  public async processLogin(input: LoginInput): Promise<Member> {
    const member = await this.memberModel
      .findOne(
        { memberNick: input.memberNick },
        { memberNick: 1, memberPassword: 1 }
      )
      .exec();
    if (!member) throw new Errors(HTTPCode.NOT_FOUND, Message.NO_MEMBER_NICK);

    const isMatch = await bcrypt.compare(
      input.memberPassword,
      member.memberPassword || ""
    );
    if (!isMatch) {
      throw new Errors(HTTPCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
    }

    const result = await this.memberModel.findById(member._id).lean<Member>().exec();
    if (!result) throw new Errors(HTTPCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  /** BSSR: Get All Registered Users for Brand Admin **/
  public async getUsers(): Promise<Member[]> {
    const result = await this.memberModel
      .find({ memberType: MemberType.USER })
      .lean<Member[]>()
      .exec();
    if (!result) throw new Errors(HTTPCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  /** BSSR: Update Member Status by Admin **/
  public async updateChosenUser(input: MemberUpdateInput): Promise<Member> {
    input._id = shapeIntoMongooseObjectId(input._id);
    const result = await this.memberModel
      .findByIdAndUpdate({ _id: input._id }, input, { new: true })
      .lean<Member>()
      .exec();
    if (!result) throw new Errors(HTTPCode.NOT_MODIFIED, Message.UPDATE_FAILED);

    return result;
  }

  /** BSSR: Update Member Loyalty Reward Points by Admin **/
  public async updateMemberPointsByAdmin(
    id: string,
    points: number
  ): Promise<Member> {
    const memberId = shapeIntoMongooseObjectId(id);
    const result = await this.memberModel
      .findByIdAndUpdate(
        memberId,
        { $set: { memberPoints: Number(points) } },
        { new: true }
      )
      .lean<Member>()
      .exec();
    if (!result) throw new Errors(HTTPCode.NOT_MODIFIED, Message.UPDATE_FAILED);

    return result;
  }
}

export default MemberService;
