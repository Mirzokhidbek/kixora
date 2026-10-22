import { Request, Response } from "express";
import { HTTPCode } from "../libs/Errors";
import PaymentService from "../services/Payment.service";
import { orderPaySchema, parse } from "../libs/validation";

const paymentService = new PaymentService();

const paymentController = {
  /** Public: which payment methods the checkout may offer */
  getConfig: (_req: Request, res: Response) => {
    res.status(HTTPCode.OK).json(paymentService.getConfig());
  },

  /** Test mode only: simulated provider confirms the member's unpaid order */
  payWithTestProvider: async (req: Request, res: Response) => {
    const { orderId } = parse(orderPaySchema, req.body);
    res.status(HTTPCode.OK).json(await paymentService.payWithTestProvider(req.member!, orderId));
  },
};

export default paymentController;
