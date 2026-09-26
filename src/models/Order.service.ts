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
}

export default OrderService;
