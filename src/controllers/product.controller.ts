import { Request, Response } from "express";
import { HTTPCode } from "../libs/Errors";
import ProductService from "../services/Product.service";
import { shapeIntoMongooseObjectId } from "../libs/config";
import { aiSearchSchema, parse, productInquirySchema } from "../libs/validation";

const productService = new ProductService();

const productController = {
  /** SPA: Products with filters, search, sorting & pagination **/
  getProducts: async (req: Request, res: Response) => {
    const inquiry = parse(productInquirySchema, req.query);
    res.status(HTTPCode.OK).json(await productService.getProducts(inquiry));
  },

  /** SPA: Single product (+ unique view tracking for signed-in members) **/
  getProduct: async (req: Request, res: Response) => {
    const memberId = req.member?._id ? shapeIntoMongooseObjectId(req.member._id) : undefined;
    res.status(HTTPCode.OK).json(await productService.getProduct(memberId, String(req.params.id)));
  },

  /** SPA: AI natural-language search **/
  aiSearchProducts: async (req: Request, res: Response) => {
    const { query } = parse(aiSearchSchema, req.body);
    res.status(HTTPCode.OK).json(await productService.aiSearchProducts(query));
  },
};

export default productController;
