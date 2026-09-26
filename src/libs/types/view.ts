import { Types } from "mongoose";
import { ViewGroup } from "../enums/view.enum";

export interface View {
  _id: Types.ObjectId;
  viewGroup: ViewGroup;
  memberId: Types.ObjectId;
  viewRefId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ViewInput {
  memberId: Types.ObjectId;
  viewRefId: Types.ObjectId;
  viewGroup: ViewGroup;
}
