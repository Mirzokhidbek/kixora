import { Request, Response } from "express";
import { HTTPCode } from "../libs/Errors";
import SupportService from "../services/Support.service";
import { parse, subscribeSchema, supportMessageSchema, unsubscribeSchema } from "../libs/validation";

const supportService = new SupportService();

/** SPA: Help-page contact form and footer newsletter */
const supportController = {
  createMessage: async (req: Request, res: Response) => {
    const input = parse(supportMessageSchema, req.body);
    res.status(HTTPCode.CREATED).json(await supportService.createMessage(input, req.member?._id));
  },

  subscribe: async (req: Request, res: Response) => {
    const { email } = parse(subscribeSchema, req.body);
    res.status(HTTPCode.OK).json(await supportService.subscribe(email));
  },

  unsubscribe: async (req: Request, res: Response) => {
    const { email, token } = parse(unsubscribeSchema, req.body);
    res.status(HTTPCode.OK).json(await supportService.unsubscribe(email, token));
  },
};

export default supportController;
