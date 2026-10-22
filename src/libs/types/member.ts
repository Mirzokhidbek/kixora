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
  passwordChangedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/** Minimal identity stored inside the JWT */
export interface AuthPayload {
  _id: string;
  memberType: MemberType;
  memberNick: string;
  /** issued-at (seconds), added by jsonwebtoken */
  iat?: number;
}

/** Plain-JSON admin identity kept in the express session */
export interface SessionMember extends AuthPayload {
  memberPhone?: string;
  memberImage?: string;
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

export interface GoogleAuthInput {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
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
    member: SessionMember;
    /** CSRF token for admin state-changing requests */
    csrfToken: string;
    /** Password was correct; waiting for the 2FA code */
    pending2faAdminId: string;
    /** 2FA enrolment in progress (secret not yet confirmed) */
    pendingTotpSecret: string;
  }
}

declare global {
  namespace Express {
    interface Request {
      member?: AuthPayload;
    }
  }
}
