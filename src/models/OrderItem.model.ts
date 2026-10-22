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
    /** EU size chosen by the customer (needed to ship the right pair) */
    itemSize: {
      type: Number,
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
