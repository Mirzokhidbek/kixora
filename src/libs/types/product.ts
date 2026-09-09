import { Types } from "mongoose";
import {
  ProductCollection,
  ProductSize,
  ProductStatus,
  ProductVolume,
} from "../enums/product.enum";

export interface Product {
  _id: Types.ObjectId;
  productStatus: ProductStatus;
  productCollection: ProductCollection;
  productName: string;
  productPrice: number;
  productLeftCount: number;
  productSizes: number[];
  productColors: string[];
  productSize?: ProductSize | string;
  productVolume?: ProductVolume;
  productDesc?: string;
  productImages: string[];
  productViews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductInput {
  productStatus?: ProductStatus;
  productCollection: ProductCollection;
  productName: string;
  productPrice: number;
  productLeftCount: number;
  productSizes?: number[];
  productColors?: string[];
  productSize?: ProductSize | string;
  productVolume?: ProductVolume;
  productDesc?: string;
  productImages?: string[];
  productViews?: number;
}

export interface ProductUpdateInput {
  _id?: Types.ObjectId | string;
  productStatus?: ProductStatus;
  productCollection?: ProductCollection;
  productName?: string;
  productPrice?: number;
  productLeftCount?: number;
  productSizes?: number[];
  productColors?: string[];
  productSize?: ProductSize | string;
  productDesc?: string;
  productImages?: string[];
}

export interface ProductInquiry {
  order?: string;
  page: number;
  limit: number;
  productCollection?: ProductCollection;
  search?: string;
  size?: number;
  color?: string;
}

export interface ProductDashboardMetrics {
  totalProducts: number;
  activeProducts: number;
  lowStockCount: number;
  categoryBreakdown: Record<string, number>;
}
