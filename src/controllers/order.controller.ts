import { Request, Response } from "express";
import { T } from "../libs/types/common";
import Errors, { HTTPCode } from "../libs/Errors";
import OrderService from "../models/Order.service";
import { OrderInquiry, OrderItemInput, OrderUpdateInput } from "../libs/types/order";
import { OrderStatus } from "../libs/enums/order.enum";

const orderService = new OrderService();
const orderController: T = {};

/** SPA: Create New Order **/
orderController.createOrder = async (req: Request, res: Response) => {
  try {
    console.log("createOrder");
    const input: OrderItemInput[] = req.body;
    const result = await orderService.createOrder(req.member!, input);

    res.status(HTTPCode.CREATED).json(result);
  } catch (err) {
    console.log("Error, createOrder:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

/** SPA: Get Authenticated User's Orders with Lookups **/
orderController.getMyOrders = async (req: Request, res: Response) => {
  try {
    console.log("getMyOrders");
    const { page, limit, orderStatus } = req.query;
    const inquiry: OrderInquiry = {
      page: Number(page || 1),
      limit: Number(limit || 5),
      orderStatus: (orderStatus as OrderStatus) || OrderStatus.PAUSE,
    };

    const result = await orderService.getMyOrders(req.member!, inquiry);
    res.status(HTTPCode.OK).json(result);
  } catch (err) {
    console.log("Error, getMyOrders:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

/** SPA: Update Order Status **/
orderController.updateOrder = async (req: Request, res: Response) => {
  try {
    console.log("updateOrder");
    const input: OrderUpdateInput = req.body;
    const result = await orderService.updateOrder(req.member!, input);

    res.status(HTTPCode.OK).json(result);
  } catch (err) {
    console.log("Error, updateOrder:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default orderController;
