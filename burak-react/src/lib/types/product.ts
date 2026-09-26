import { ProductCollection, ProductSize, ProductStatus } from "../enums/common.enum";

export interface Product {
  _id: string;
  productStatus: ProductStatus;
  productCollection: ProductCollection;
  productName: string;
  productPrice: number;
  productLeftCount: number;
  productSize?: ProductSize;
  productVolume?: number;
  productDesc?: string;
  productImages: string[];
  productViews: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductInquiry {
  order?: string;
  page: number;
  limit: number;
  productCollection?: ProductCollection;
  search?: string;
}
