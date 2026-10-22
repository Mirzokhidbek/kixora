import { Request, Response } from "express";
import { HTTPCode } from "../libs/Errors";
import OrderService from "../services/Order.service";
import AccountService from "../services/Account.service";
import {
  orderCreateSchema,
  orderInquirySchema,
  orderUpdateSchema,
  parse,
} from "../libs/validation";

const orderService = new OrderService();
const accountService = new AccountService();

const orderController = {
  /** SPA: Create order (prices are taken from the DB, client prices are ignored) **/
  createOrder: async (req: Request, res: Response) => {
    const input = parse(orderCreateSchema, req.body);
    await accountService.assertCanOrder(req.member!);
    res.status(HTTPCode.CREATED).json(await orderService.createOrder(req.member!, input));
  },

  getMyOrders: async (req: Request, res: Response) => {
    const inquiry = parse(orderInquirySchema, req.query);
    res.status(HTTPCode.OK).json(await orderService.getMyOrders(req.member!, inquiry));
  },

  updateOrder: async (req: Request, res: Response) => {
    const input = parse(orderUpdateSchema, req.body);
    res.status(HTTPCode.OK).json(await orderService.updateOrder(req.member!, input));
  },
};

export default orderController;
