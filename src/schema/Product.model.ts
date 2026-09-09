import mongoose, { Schema } from "mongoose";
import {
  ProductCollection,
  ProductSize,
  ProductStatus,
  ProductVolume,
} from "../libs/enums/product.enum";

const productSchema = new Schema(
  {
    productStatus: {
      type: String,
      enum: ProductStatus,
      default: ProductStatus.PAUSE,
    },
    productCollection: {
      type: String,
      enum: ProductCollection,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    productLeftCount: {
      type: Number,
      required: true,
    },
    productSizes: {
      type: [Number],
      default: [38, 39, 40, 41, 42, 43, 44, 45],
    },
    productColors: {
      type: [String],
      default: ["Black", "White"],
    },
    productSize: {
      type: String,
      enum: ProductSize,
      default: ProductSize.NORMAL,
    },
    productVolume: {
      type: Number,
      enum: ProductVolume,
      default: ProductVolume.ONE,
    },
    productDesc: {
      type: String,
    },
    productImages: {
      type: [String],
      default: [],
    },
    productViews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

/** High-Performance MongoDB Database Indexes **/
productSchema.index({ productCollection: 1, productStatus: 1 });
productSchema.index({ productStatus: 1, createdAt: -1 });
productSchema.index({ productPrice: 1 });
productSchema.index({ productViews: -1 });
productSchema.index({ productSizes: 1 });
productSchema.index({ productColors: 1 });

export default mongoose.model("Product", productSchema);
