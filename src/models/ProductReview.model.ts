import mongoose, { Schema } from "mongoose";
import { ReviewStatus } from "../libs/enums/review.enum";

/** A verified-buyer review: one per (member, product), moderated by the admin. */
const productReviewSchema = new Schema(
  {
    memberId: { type: Schema.Types.ObjectId, required: true, ref: "Member" },
    productId: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
    reviewRating: { type: Number, required: true, min: 1, max: 5 },
    reviewComment: { type: String, required: true, maxlength: 1000 },
    reviewStatus: {
      type: String,
      enum: Object.values(ReviewStatus),
      default: ReviewStatus.VISIBLE,
    },
    adminReply: { type: String, maxlength: 1000, default: "" },
  },
  { timestamps: true }
);

productReviewSchema.index({ memberId: 1, productId: 1 }, { unique: true });
productReviewSchema.index({ productId: 1, reviewStatus: 1, createdAt: -1 });
productReviewSchema.index({ reviewStatus: 1, createdAt: -1 });

export default mongoose.model("ProductReview", productReviewSchema);
