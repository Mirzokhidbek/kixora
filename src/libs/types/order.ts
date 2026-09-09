import { Types } from "mongoose";
import { OrderStatus } from "../enums/order.enum";
import { Product } from "./product";
import { Member } from "./member";

export interface OrderItem {
  _id: Types.ObjectId;
  itemQuantity: number;
  itemPrice: number;
  orderId: Types.ObjectId;
  productId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  _id: Types.ObjectId;
  orderTotal: number;
  orderDelivery: number;
  orderStatus: OrderStatus;
  memberId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  /** from MongoDB Aggregation Lookup **/
  orderItems?: OrderItem[];
  productData?: Product[];
  memberData?: Member;
}

export interface OrderItemInput {
  itemQuantity: number;
  itemPrice: number;
  productId: Types.ObjectId | string;
  orderId?: Types.ObjectId | string;
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

export interface OrderDashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  processOrders: number;
  finishOrders: number;
  monthlySales: {
    months: string[];
    revenues: number[];
  };
  statusBreakdown: {
    pause: number;
    process: number;
    finish: number;
  };
}
