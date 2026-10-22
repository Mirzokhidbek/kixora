import mongoose, { Schema } from "mongoose";

/** One document per (member, product) like. The unique index makes likes idempotent. */
const productLikeSchema = new Schema(
  {
    memberId: { type: Schema.Types.ObjectId, required: true, ref: "Member" },
    productId: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
  },
  { timestamps: true }
);

productLikeSchema.index({ memberId: 1, productId: 1 }, { unique: true });
productLikeSchema.index({ memberId: 1, createdAt: -1 });

export default mongoose.model("ProductLike", productLikeSchema);
