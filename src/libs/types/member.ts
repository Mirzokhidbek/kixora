import { Types } from "mongoose";
import { MemberStatus, MemberType } from "../enums/member.enum";

export interface Member {
  _id: Types.ObjectId;
  memberType: MemberType;
  memberStatus: MemberStatus;
  memberNick: string;
  memberEmail?: string;
  memberPhone: string;
  memberPassword?: string;
  memberAddress?: string;
  memberDesc?: string;
  memberImage?: string;
  memberPoints: number;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemberInput {
  memberType?: MemberType;
  memberStatus?: MemberStatus;
  memberNick: string;
  memberEmail?: string;
  memberPhone?: string;
  memberPassword: string;
  memberAddress?: string;
  memberDesc?: string;
  memberImage?: string;
  memberPoints?: number;
}

export interface LoginInput {
  memberEmail?: string;
  memberNick?: string;
  memberPassword: string;
}

export interface MemberUpdateInput {
  _id: Types.ObjectId | string;
  memberStatus?: MemberStatus;
  memberPhone?: string;
  memberNick?: string;
  memberPassword?: string;
  memberAddress?: string;
  memberDesc?: string;
  memberImage?: string;
  memberPoints?: number;
}

declare module "express-session" {
  interface SessionData {
    member: Member;
  }
}

declare global {
  namespace Express {
    interface Request {
      member?: Member;
    }
  }
}
