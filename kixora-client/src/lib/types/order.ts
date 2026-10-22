import { OrderStatus } from "../enums/common.enum";
import type { Product } from "./product";

export interface OrderItem {
  _id: string;
  itemQuantity: number;
  itemPrice: number;
  itemSize?: number;
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
  orderRecipient?: string;
  orderPhone?: string;
  orderAddress?: string;
  orderNote?: string;
  orderItems: OrderItem[];
  productData?: Product[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemInput {
  productId: string;
  itemQuantity: number;
  itemSize?: number;
}

/** Delivery details sent with a new order */
export interface ShippingInfo {
  recipient: string;
  phone: string;
  address: string;
  note?: string;
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
