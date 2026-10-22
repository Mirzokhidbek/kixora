import mongoose, { Schema } from "mongoose";

const orderItemSchema = new Schema(
  {
    itemQuantity: {
      type: Number,
      required: true,
    },

    itemPrice: {
      type: Number,
      required: true,
    },

    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

/** High-Performance MongoDB Database Indexes **/
orderItemSchema.index({ orderId: 1 });
orderItemSchema.index({ productId: 1 });

export default mongoose.model("OrderItem", orderItemSchema);
