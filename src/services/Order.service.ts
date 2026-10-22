import OrderModel from "../models/Order.model";
import OrderItemModel from "../models/OrderItem.model";
import MemberModel from "../models/Member.model";
import ProductModel from "../models/Product.model";
import { AuthPayload } from "../libs/types/member";
import { Order, OrderDashboardMetrics, OrderItem } from "../libs/types/order";
import { Product } from "../libs/types/product";
import { shapeIntoMongooseObjectId } from "../libs/config";
import Errors, { HTTPCode, Message } from "../libs/Errors";
import { OrderStatus } from "../libs/enums/order.enum";
import { ProductStatus } from "../libs/enums/product.enum";
import {
  allowedSourceStatuses,
  calculateTotals,
  mergeOrderLines,
  pointsForTotal,
} from "../libs/orderRules";
import { z } from "zod";
import { orderCreateSchema, orderInquirySchema, orderUpdateSchema } from "../libs/validation";

type OrderLines = z.infer<typeof orderCreateSchema>;
type OrderInquiry = z.infer<typeof orderInquirySchema>;
type OrderUpdate = z.infer<typeof orderUpdateSchema>;

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

class OrderService {
  private readonly orderModel = OrderModel;
  private readonly orderItemModel = OrderItemModel;
  private readonly memberModel = MemberModel;
  private readonly productModel = ProductModel;

  /**
   * SPA: Create order.
   * Prices come from the database (never from the client) and stock is reserved
   * with conditional atomic decrements. If any step fails, completed steps are
   * compensated so no partial order or lost stock remains.
   */
  public async createOrder(member: AuthPayload, input: OrderLines): Promise<Order> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const lines = mergeOrderLines(input);

    const products = await this.productModel
      .find({
        _id: { $in: lines.map((l) => shapeIntoMongooseObjectId(l.productId)) },
        productStatus: ProductStatus.PROCESS,
      })
      .lean<Product[]>()
      .exec();
    const productById = new Map(products.map((p) => [String(p._id), p]));
    if (productById.size !== lines.length) {
      throw new Errors(HTTPCode.BAD_REQUEST, Message.OUT_OF_STOCK);
    }

    const reserved: { productId: string; itemQuantity: number }[] = [];
    let orderId: unknown = null;
    try {
      for (const line of lines) {
        const res = await this.productModel
          .updateOne(
            {
              _id: shapeIntoMongooseObjectId(line.productId),
              productStatus: ProductStatus.PROCESS,
              productLeftCount: { $gte: line.itemQuantity },
            },
            { $inc: { productLeftCount: -line.itemQuantity } }
          )
          .exec();
        if (res.modifiedCount !== 1) throw new Errors(HTTPCode.BAD_REQUEST, Message.OUT_OF_STOCK);
        reserved.push(line);
      }

      const totals = calculateTotals(
        lines.map((l) => ({ price: productById.get(l.productId)!.productPrice, quantity: l.itemQuantity }))
      );

      const newOrder = await this.orderModel.create({
        orderTotal: totals.total,
        orderDelivery: totals.delivery,
        memberId,
      });
      orderId = newOrder._id;

      await this.orderItemModel.insertMany(
        lines.map((l) => ({
          itemQuantity: l.itemQuantity,
          itemPrice: productById.get(l.productId)!.productPrice,
          orderId: newOrder._id,
          productId: shapeIntoMongooseObjectId(l.productId),
        }))
      );

      return newOrder.toObject() as Order;
    } catch (err) {
      await this.restoreStock(reserved);
      if (orderId) {
        await this.orderItemModel.deleteMany({ orderId }).exec().catch(() => undefined);
        await this.orderModel.deleteOne({ _id: orderId }).exec().catch(() => undefined);
      }
      throw err;
    }
  }

  private async restoreStock(lines: { productId: string | unknown; itemQuantity: number }[]) {
    await Promise.all(
      lines.map((l) =>
        this.productModel
          .updateOne({ _id: l.productId }, { $inc: { productLeftCount: l.itemQuantity } })
          .exec()
          .catch((e) => console.error("Failed to restore stock:", l.productId, e))
      )
    );
  }

  /** SPA: Get Authenticated User's Orders **/
  public async getMyOrders(member: AuthPayload, inquiry: OrderInquiry): Promise<Order[]> {
    return this.orderModel
      .aggregate<Order>([
        { $match: { memberId: shapeIntoMongooseObjectId(member._id), orderStatus: inquiry.orderStatus } },
        { $sort: { updatedAt: -1 } },
        { $skip: (inquiry.page - 1) * inquiry.limit },
        { $limit: inquiry.limit },
        {
          $lookup: { from: "orderitems", localField: "_id", foreignField: "orderId", as: "orderItems" },
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
  }

  /** SPA: Customer status change (pay / cancel / confirm receipt) **/
  public async updateOrder(member: AuthPayload, input: OrderUpdate): Promise<Order> {
    return this.transitionOrder(input.orderId, input.orderStatus, "member", member._id);
  }

  /** BSSR: Admin status change **/
  public async updateOrderByAdmin(input: OrderUpdate): Promise<Order> {
    return this.transitionOrder(input.orderId, input.orderStatus, "admin");
  }

  /**
   * Atomic state machine: the update only matches when the order is currently in
   * an allowed source status, so side effects (points, stock restore) run exactly once.
   */
  private async transitionOrder(
    orderIdRaw: string,
    to: OrderStatus,
    actor: "member" | "admin",
    memberIdRaw?: string
  ): Promise<Order> {
    const from = allowedSourceStatuses(to, actor);
    if (from.length === 0) throw new Errors(HTTPCode.BAD_REQUEST, Message.INVALID_STATUS_TRANSITION);

    const filter: Record<string, unknown> = {
      _id: shapeIntoMongooseObjectId(orderIdRaw),
      orderStatus: { $in: from },
    };
    if (memberIdRaw) filter.memberId = shapeIntoMongooseObjectId(memberIdRaw);

    const result = await this.orderModel
      .findOneAndUpdate(filter, { $set: { orderStatus: to } }, { new: true })
      .lean<Order>()
      .exec();
    if (!result) throw new Errors(HTTPCode.BAD_REQUEST, Message.INVALID_STATUS_TRANSITION);

    if (to === OrderStatus.FINISH) {
      await this.memberModel
        .updateOne({ _id: result.memberId }, { $inc: { memberPoints: pointsForTotal(result.orderTotal) } })
        .exec();
    } else if (to === OrderStatus.DELETE) {
      const items = await this.orderItemModel.find({ orderId: result._id }).lean<OrderItem[]>().exec();
      await this.restoreStock(items.map((i) => ({ productId: i.productId, itemQuantity: i.itemQuantity })));
    }
    return result;
  }

  /** BSSR: Paginated orders with customer & product details **/
  public async getAllOrdersByAdmin(page: number, limit: number): Promise<{ orders: Order[]; total: number }> {
    const [orders, total] = await Promise.all([
      this.orderModel
        .aggregate<Order>([
          { $sort: { createdAt: -1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit },
          {
            $lookup: {
              from: "members",
              localField: "memberId",
              foreignField: "_id",
              as: "memberData",
              pipeline: [{ $project: { memberNick: 1, memberPhone: 1, memberEmail: 1, memberImage: 1, memberAddress: 1 } }],
            },
          },
          { $unwind: { path: "$memberData", preserveNullAndEmptyArrays: true } },
          { $lookup: { from: "orderitems", localField: "_id", foreignField: "orderId", as: "orderItems" } },
          {
            $lookup: {
              from: "products",
              localField: "orderItems.productId",
              foreignField: "_id",
              as: "productData",
            },
          },
        ])
        .exec(),
      this.orderModel.countDocuments().exec(),
    ]);
    return { orders, total };
  }

  /** BSSR: Dashboard metrics computed inside MongoDB (no full collection load) **/
  public async getAdminDashboardMetrics(): Promise<OrderDashboardMetrics> {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [statusAgg, monthlyAgg] = await Promise.all([
      this.orderModel
        .aggregate<{ _id: OrderStatus; count: number; revenue: number }>([
          { $group: { _id: "$orderStatus", count: { $sum: 1 }, revenue: { $sum: "$orderTotal" } } },
        ])
        .exec(),
      this.orderModel
        .aggregate<{ _id: { y: number; m: number }; revenue: number }>([
          { $match: { createdAt: { $gte: start }, orderStatus: { $ne: OrderStatus.DELETE } } },
          {
            $group: {
              _id: { y: { $year: "$createdAt" }, m: { $month: "$createdAt" } },
              revenue: { $sum: "$orderTotal" },
            },
          },
        ])
        .exec(),
    ]);

    const byStatus = (s: OrderStatus) => statusAgg.find((r) => r._id === s);
    const pendingOrders = byStatus(OrderStatus.PAUSE)?.count || 0;
    const processOrders = byStatus(OrderStatus.PROCESS)?.count || 0;
    const finishOrders = byStatus(OrderStatus.FINISH)?.count || 0;
    const totalOrders = statusAgg.reduce((acc, r) => acc + r.count, 0);
    // Revenue counts orders that were not cancelled
    const totalRevenue = statusAgg
      .filter((r) => r._id !== OrderStatus.DELETE)
      .reduce((acc, r) => acc + r.revenue, 0);

    // Year-aware buckets for the last 6 months
    const months: string[] = [];
    const revenues: number[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const row = monthlyAgg.find((r) => r._id.y === d.getFullYear() && r._id.m === d.getMonth() + 1);
      months.push(MONTH_NAMES[d.getMonth()]);
      revenues.push(Math.round((row?.revenue || 0) * 100) / 100);
    }

    return {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders,
      pendingOrders,
      processOrders,
      finishOrders,
      monthlySales: { months, revenues },
      statusBreakdown: { pause: pendingOrders, process: processOrders, finish: finishOrders },
    };
  }
}

export default OrderService;
