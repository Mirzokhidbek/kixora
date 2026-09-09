import { Request, Response } from "express";
import { T } from "../libs/types/common";
import Errors, { HTTPCode, Message } from "../libs/Errors";
import ProductService from "../models/Product.service";
import { ProductInquiry, ProductInput } from "../libs/types/product";
import { ProductCollection } from "../libs/enums/product.enum";
import { shapeIntoMongooseObjectId } from "../libs/config";

const productService = new ProductService();
const productController: T = {};

/** SPA: Get Products with Filters, Search, Sorting & Pagination **/
productController.getProducts = async (req: Request, res: Response) => {
  try {
    console.log("getProducts");
    const { page, limit, order, productCollection, search, size, color } = req.query;
    const inquiry: ProductInquiry = {
      order: String(order || "createdAt"),
      page: Number(page || 1),
      limit: Number(limit || 8),
    };
    if (productCollection) {
      inquiry.productCollection = productCollection as ProductCollection;
    }
    if (search) inquiry.search = String(search);
    if (size) inquiry.size = Number(size);
    if (color) inquiry.color = String(color);

    const result = await productService.getProducts(inquiry);
    res.status(HTTPCode.OK).json(result);
  } catch (err) {
    console.log("Error, getProducts:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

/** SPA: Get Single Product & Track Member Views **/
productController.getProduct = async (req: Request, res: Response) => {
  try {
    console.log("getProduct");
    const { id } = req.params;
    const memberId = req.member?._id
      ? shapeIntoMongooseObjectId(req.member._id)
      : undefined;

    const result = await productService.getProduct(memberId, String(id));
    res.status(HTTPCode.OK).json(result);
  } catch (err) {
    console.log("Error, getProduct:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

/** SPA & BSSR: Get All Products **/
productController.getAllProducts = async (req: Request, res: Response) => {
  try {
    console.log("getAllProducts");
    const data = await productService.getAllProducts();
    res.render("products", { products: data });
  } catch (err) {
    console.log("Error, getAllProducts:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

/** BSSR: Create New Product **/
productController.createNewProduct = async (req: Request, res: Response) => {
  try {
    console.log("createNewProduct");
    if (!req.files?.length)
      throw new Errors(HTTPCode.BAD_REQUEST, Message.CREATE_FAILED);

    const data: ProductInput = req.body;
    data.productImages = (req.files as Express.Multer.File[]).map((ele) => {
      return ele.path.replace(/\\/g, "/");
    });

    if (req.body.productSizes) {
      if (typeof req.body.productSizes === "string") {
        data.productSizes = req.body.productSizes
          .split(",")
          .map((s: string) => Number(s.trim()))
          .filter((n: number) => !isNaN(n));
      } else if (Array.isArray(req.body.productSizes)) {
        data.productSizes = req.body.productSizes.map(Number);
      }
    } else {
      data.productSizes = [38, 39, 40, 41, 42, 43, 44, 45];
    }

    if (req.body.productColors) {
      if (typeof req.body.productColors === "string") {
        data.productColors = req.body.productColors
          .split(",")
          .map((c: string) => c.trim())
          .filter(Boolean);
      } else if (Array.isArray(req.body.productColors)) {
        data.productColors = req.body.productColors;
      }
    } else {
      data.productColors = ["Black", "White"];
    }

    await productService.createNewProduct(data);
    res.send(
      `<script> alert("Successfully created!"); window.location.replace('/admin/product/all'); </script>`
    );
  } catch (err) {
    console.log("Error, createNewProduct:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script> alert("${message}"); window.location.replace('/admin/product/all'); </script>`
    );
  }
};

/** BSSR: Update Product by ID **/
productController.updateChosenProduct = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("updateChosenProduct");
    const id = String(req.params.id);
    const result = await productService.updateChosenProduct(id, req.body);
    res.json({ data: result });
  } catch (err) {
    console.log("Error, updateChosenProduct:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

/** SPA: AI Semantic Natural Language Footwear Search **/
productController.aiSearchProducts = async (req: Request, res: Response) => {
  try {
    console.log("aiSearchProducts");
    const { query } = req.body;
    if (!query || typeof query !== "string") {
      throw new Errors(HTTPCode.BAD_REQUEST, Message.BLANK_NOT_ALLOWED);
    }

    const result = await productService.aiSearchProducts(query);
    res.status(HTTPCode.OK).json(result);
  } catch (err) {
    console.log("Error, aiSearchProducts:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default productController;

