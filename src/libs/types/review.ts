import { Types } from "mongoose";
import { ReviewStatus } from "../enums/review.enum";

export interface ProductReview {
  _id: Types.ObjectId;
  memberId: Types.ObjectId;
  productId: Types.ObjectId;
  reviewRating: number;
  reviewComment: string;
  reviewStatus: ReviewStatus;
  adminReply: string;
  createdAt: Date;
  updatedAt: Date;
  /** from $lookup */
  memberData?: { memberNick: string; memberImage?: string };
  productData?: { productName: string; productImages: string[] };
}

export interface ReviewSummary {
  ratingAvg: number;
  reviewCount: number;
  /** count per star: index 0 = 1 star ... index 4 = 5 stars */
  distribution: number[];
}
