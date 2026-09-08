import { OrderStatus } from "../enums/common.enum";
import type { Product } from "./product";

export interface OrderItem {
  _id: string;
  itemQuantity: number;
  itemPrice: number;
  orderId: string;
  productId: string;
  productData?: Product;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  orderTotal: number;
  orderDelivery: number;
  orderStatus: OrderStatus;
  memberId: string;
  orderItems: OrderItem[];
  productData?: Product[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemInput {
  productId: string;
  itemQuantity: number;
  itemPrice: number;
}

export interface OrderInquiry {
  page: number;
  limit: number;
  orderStatus: OrderStatus;
}

export interface OrderUpdateInput {
  orderId: string;
  orderStatus: OrderStatus;
}
