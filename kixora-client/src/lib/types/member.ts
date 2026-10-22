import { MemberStatus, MemberType } from "../enums/common.enum";

export interface Member {
  _id: string;
  memberType: MemberType;
  memberStatus: MemberStatus;
  memberNick: string;
  memberEmail?: string;
  memberPhone?: string;
  memberAddress?: string;
  memberDesc?: string;
  memberImage?: string;
  memberPoints: number;
  googleId?: string;
  /** false = email signup not confirmed yet (ordering is blocked until confirmed) */
  memberEmailVerified?: boolean;
  createdAt: string;
  updatedAt: string;
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
}

export interface LoginInput {
  memberEmail?: string;
  memberNick?: string;
  memberPassword: string;
}
