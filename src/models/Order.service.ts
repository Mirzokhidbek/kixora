import OrderModel from "../schema/Order.model";
import OrderItemModel from "../schema/OrderItem.model";
import MemberModel from "../schema/Member.model";
import { Member } from "../libs/types/member";
import {
  Order,
  OrderInquiry,
  OrderItemInput,
  OrderUpdateInput,
} from "../libs/types/order";
import { shapeIntoMongooseObjectId } from "../libs/config";
import Errors, { HTTPCode, Message } from "../libs/Errors";
import { OrderStatus } from "../libs/enums/order.enum";

class OrderService {
  private readonly orderModel;
  private readonly orderItemModel;
  private readonly memberModel;

  constructor() {
    this.orderModel = OrderModel;
    this.orderItemModel = OrderItemModel;
    this.memberModel = MemberModel;
  }

  /** SPA: Create New Order & Order Items **/
  public async createOrder(
    member: Member,
    input: OrderItemInput[]
  ): Promise<Order> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const amount = input.reduce((acc, item) => {
      return acc + item.itemPrice * item.itemQuantity;
    }, 0);
    const delivery = amount < 100 ? 5 : 0;

    try {
      const newOrder: any = await this.orderModel.create({
        orderTotal: amount + delivery,
        orderDelivery: delivery,
        memberId: memberId,
      });

      const orderId = newOrder._id;
      console.log("orderId:", orderId);

      // Create Order Items
      await Promise.all(
        input.map(async (item: OrderItemInput) => {
          await this.orderItemModel.create({
            itemQuantity: item.itemQuantity,
            itemPrice: item.itemPrice,
            orderId: orderId,
            productId: shapeIntoMongooseObjectId(item.productId),
          });
        })
      );

      return newOrder.toJSON() as Order;
    } catch (err) {
      console.error("Error, createOrder:", err);
      throw new Errors(HTTPCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  /** SPA: Get Authenticated User's Orders with Aggregation & Lookup **/
  public async getMyOrders(
    member: Member,
    inquiry: OrderInquiry
  ): Promise<Order[]> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const matches = {
      memberId: memberId,
      orderStatus: inquiry.orderStatus,
    };

    const result = await this.orderModel
      .aggregate([
        { $match: matches },
        { $sort: { updatedAt: -1 } },
        { $skip: (inquiry.page * 1 - 1) * inquiry.limit },
        { $limit: inquiry.limit * 1 },
        {
          $lookup: {
            from: "orderitems",
            localField: "_id",
            foreignField: "orderId",
            as: "orderItems",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "orderItems.productId",
            foreignField: "_id",
            as: "productData",
          },
        },
      ])
      .exec();

    if (!result) throw new Errors(HTTPCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result as Order[];
  }

  /** SPA: Update Order Status & Award Member Points **/
  public async updateOrder(
    member: Member,
    input: OrderUpdateInput
  ): Promise<Order> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const orderId = shapeIntoMongooseObjectId(input.orderId);
    const orderStatus = input.orderStatus;

    const result = await this.orderModel
      .findOneAndUpdate(
        { memberId: memberId, _id: orderId },
        { orderStatus: orderStatus },
        { new: true }
      )
      .exec();

    if (!result) throw new Errors(HTTPCode.NOT_MODIFIED, Message.UPDATE_FAILED);

    // If order is completed (FINISH), reward 1 point for every 10$ spent
    if (orderStatus === OrderStatus.FINISH) {
      const points = Math.round(result.orderTotal / 10);
      await this.memberModel
        .findByIdAndUpdate(
          { _id: memberId },
          { $inc: { memberPoints: points } }
        )
        .exec();
    }

    return (result as any).toJSON() as Order;
  }

  /** BSSR: Get All Orders for Brand Admin with Customer & Product details **/
  public async getAllOrdersByAdmin(): Promise<Order[]> {
    const result = await this.orderModel
      .aggregate([
        { $sort: { createdAt: -1 } },
        {
          $lookup: {
            from: "members",
            localField: "memberId",
            foreignField: "_id",
            as: "memberData",
          },
        },
        {
          $unwind: {
            path: "$memberData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "orderitems",
            localField: "_id",
            foreignField: "orderId",
            as: "orderItems",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "orderItems.productId",
            foreignField: "_id",
            as: "productData",
          },
        },
      ])
      .exec();

    if (!result) throw new Errors(HTTPCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result as Order[];
  }

  /** BSSR: Update Order Status by Brand Admin **/
  public async updateOrderByAdmin(input: {
    orderId: string;
    orderStatus: OrderStatus;
  }): Promise<Order> {
    const orderId = shapeIntoMongooseObjectId(input.orderId);
    const orderStatus = input.orderStatus;

    const result = await this.orderModel
      .findByIdAndUpdate(
        { _id: orderId },
        { orderStatus: orderStatus },
        { new: true }
      )
      .exec();

    if (!result) throw new Errors(HTTPCode.NOT_MODIFIED, Message.UPDATE_FAILED);

    return (result as any).toJSON() as Order;
  }

  /** BSSR: Get Comprehensive Dashboard Metrics & Chart Datasets **/
  public async getAdminDashboardMetrics(): Promise<{
    totalRevenue: number;
    totalOrders: number;
    pendingOrders: number;
    processOrders: number;
    finishOrders: number;
    monthlySales: { months: string[]; revenues: number[] };
    statusBreakdown: { pause: number; process: number; finish: number };
  }> {
    const allOrders = await this.orderModel.find().lean().exec();

    let totalRevenue = 0;
    let pendingOrders = 0;
    let processOrders = 0;
    let finishOrders = 0;

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth();
    const months: string[] = [];
    const monthlyRevMap: { [key: string]: number } = {};

    for (let i = 5; i >= 0; i--) {
      const mIdx = (currentMonth - i + 12) % 12;
      const mName = monthNames[mIdx];
      months.push(mName);
      monthlyRevMap[mName] = 0;
    }

    allOrders.forEach((order: any) => {
      totalRevenue += order.orderTotal || 0;
      if (order.orderStatus === OrderStatus.PAUSE) pendingOrders++;
      else if (order.orderStatus === OrderStatus.PROCESS) processOrders++;
      else if (order.orderStatus === OrderStatus.FINISH) finishOrders++;

      const oDate = new Date(order.createdAt || Date.now());
      const oMonth = monthNames[oDate.getMonth()];
      if (monthlyRevMap[oMonth] !== undefined) {
        monthlyRevMap[oMonth] += order.orderTotal || 0;
      }
    });

    const revenues = months.map((m) => monthlyRevMap[m] || 0);

    return {
      totalRevenue,
      totalOrders: allOrders.length,
      pendingOrders,
      processOrders,
      finishOrders,
      monthlySales: { months, revenues },
      statusBreakdown: { pause: pendingOrders, process: processOrders, finish: finishOrders },
    };
  }
}

export default OrderService;
