import { ProductCollection, ProductSize, ProductStatus } from "../enums/common.enum";

export interface Product {
  _id: string;
  productStatus: ProductStatus;
  productCollection: ProductCollection;
  productName: string;
  productPrice: number;
  productLeftCount: number;
  productSizes?: number[];
  productColors?: string[];
  productSize?: ProductSize;
  productVolume?: number;
  productDesc?: string;
  productImages: string[];
  productViews: number;
  productLikes?: number;
  ratingAvg?: number;
  reviewCount?: number;
  /** Only on single-product responses for signed-in members */
  meLiked?: boolean;
  createdAt: string;
  updatedAt: string;
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

export interface AISearchResponse {
  query: string;
  intent: {
    collection: ProductCollection | null;
    color: string | null;
    keywords: string[];
    recommendation: string;
  };
  products: Product[];
}
