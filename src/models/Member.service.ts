import MemberModel from "../schema/Member.model";
import {
  Member,
  MemberInput,
  LoginInput,
  MemberUpdateInput,
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
      .lean()
      .exec();
    if (!result) throw new Errors(HTTPCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result as unknown as Member;
  }

  /** SPA SIGNUP (USER) **/
  public async signup(input: MemberInput): Promise<Member> {
    const salt = await bcrypt.genSalt();
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt);

    try {
      const result = await this.memberModel.create(input);
      result.memberPassword = "";
      return result.toJSON() as Member;
    } catch (err) {
      console.error("Error, signup:", err);
      throw new Errors(HTTPCode.BAD_REQUEST, Message.USED_NICK_PHONE);
    }
  }

  /** SPA LOGIN (USER) **/
  public async login(input: LoginInput): Promise<Member> {
    const member = await this.memberModel
      .findOne(
        {
          memberNick: input.memberNick,
          memberStatus: { $ne: MemberStatus.DELETE },
        },
        { memberNick: 1, memberPassword: 1, memberStatus: 1 }
      )
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

    const result = await this.memberModel.findById(member._id).exec();
    return (result as any).toJSON() as Member;
  }

  /** SPA: GOOGLE OAUTH LOGIN / SIGNUP **/
  public async googleLogin(googleData: {
    googleId: string;
    email: string;
    name: string;
    picture?: string;
  }): Promise<Member> {
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
      return member.toJSON() as unknown as Member;
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
      googleId: googleData.googleId,
      memberImage: googleData.picture || "",
      memberPoints: 100, // 100 Welcome points
    });

    return newMember.toJSON() as unknown as Member;
  }

  /** SPA: Get Authenticated Member Detail **/
  public async getMemberDetail(member: Member): Promise<Member> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const result = await this.memberModel
      .findOne({ _id: memberId, memberStatus: MemberStatus.ACTIVE })
      .exec();
    if (!result) throw new Errors(HTTPCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result.toJSON() as Member;
  }

  /** SPA: Update Member Profile & Image **/
  public async updateMember(
    member: Member,
    input: MemberUpdateInput
  ): Promise<Member> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const result = await this.memberModel
      .findOneAndUpdate({ _id: memberId }, input, { new: true })
      .exec();
    if (!result) throw new Errors(HTTPCode.NOT_MODIFIED, Message.UPDATE_FAILED);

    return (result as any).toJSON() as Member;
  }

  /** SPA: Get Top 4 Active Users by Points **/
  public async getTopUsers(): Promise<Member[]> {
    const result = await this.memberModel
      .find({
        memberType: MemberType.USER,
        memberStatus: MemberStatus.ACTIVE,
        memberPoints: { $gte: 0 },
      })
      .sort({ memberPoints: -1 })
      .limit(4)
      .exec();
    if (!result) throw new Errors(HTTPCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result as unknown as Member[];
  }

  /** BSSR SIGNUP (ADMIN / RESTAURANT) **/
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
      return result.toJSON() as Member;
    } catch (err) {
      throw new Errors(HTTPCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  /** BSSR LOGIN (ADMIN / RESTAURANT) **/
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

    const result = await this.memberModel.findById(member._id).exec();
    return (result as any).toJSON() as Member;
  }

  /** BSSR: Get All Users **/
  public async getUsers(): Promise<Member[]> {
    const result = await this.memberModel
      .find({ memberType: MemberType.USER })
      .exec();
    if (!result) throw new Errors(HTTPCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result as unknown as Member[];
  }

  /** BSSR: Update Chosen User (Status/Details) **/
  public async updateChosenUser(input: MemberUpdateInput): Promise<Member> {
    input._id = shapeIntoMongooseObjectId(input._id);
    const result = await this.memberModel
      .findByIdAndUpdate({ _id: input._id }, input, { new: true })
      .exec();
    if (!result) throw new Errors(HTTPCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    return (result as any).toJSON() as Member;
  }
}

export default MemberService;
