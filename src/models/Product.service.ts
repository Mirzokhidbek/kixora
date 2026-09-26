import ProductModel from "../schema/Product.model";
import { Product, ProductInput, ProductInquiry } from "../libs/types/product";
import Errors, { HTTPCode, Message } from "../libs/Errors";
import { shapeIntoMongooseObjectId } from "../libs/config";
import { ProductStatus } from "../libs/enums/product.enum";
import { T } from "../libs/types/common";
import { Types } from "mongoose";
import ViewService from "./View.service";
import { ViewInput } from "../libs/types/view";
import { ViewGroup } from "../libs/enums/view.enum";

class ProductService {
  private readonly productModel;
  private readonly viewService;

  constructor() {
    this.productModel = ProductModel;
    this.viewService = new ViewService();
  }

  /** SPA: Get Products with MongoDB Aggregation Pipeline **/
  public async getProducts(inquiry: ProductInquiry): Promise<Product[]> {
    const match: T = { productStatus: ProductStatus.PROCESS };

    if (inquiry.productCollection) {
      match.productCollection = inquiry.productCollection;
    }

    if (inquiry.search) {
      match.productName = { $regex: new RegExp(inquiry.search, "i") };
    }

    const sort: T =
      inquiry.order === "productPrice"
        ? { [inquiry.order]: 1 }
        : { [inquiry.order || "createdAt"]: -1 };

    const result = await this.productModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        { $skip: (inquiry.page * 1 - 1) * inquiry.limit },
        { $limit: inquiry.limit * 1 },
      ])
      .exec();

    if (!result) throw new Errors(HTTPCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result as Product[];
  }

  /** SPA: Get Single Product & Track Member Views **/
  public async getProduct(
    memberId: Types.ObjectId | undefined,
    id: string
  ): Promise<Product> {
    const productId = shapeIntoMongooseObjectId(id);

    let result = (await this.productModel
      .findOne({ _id: productId, productStatus: ProductStatus.PROCESS })
      .exec()) as unknown as Product;

    if (!result) throw new Errors(HTTPCode.NOT_FOUND, Message.NO_DATA_FOUND);

    // If authenticated user visits product, track unique view
    if (memberId) {
      const input: ViewInput = {
        memberId: memberId,
        viewRefId: productId,
        viewGroup: ViewGroup.PRODUCT,
      };

      const exist = await this.viewService.checkViewExistence(input);

      if (!exist) {
        console.log("PLAN: Insert new product view");
        await this.viewService.insertMemberView(input);

        // Increase product views count in database
        result = (await this.productModel
          .findByIdAndUpdate(
            productId,
            { $inc: { productViews: 1 } },
            { new: true }
          )
          .exec()) as unknown as Product;
      }
    }

    return result;
  }

  /** SPA & BSSR: Get All Products **/
  public async getAllProducts(): Promise<Product[]> {
    const result = await this.productModel.find().exec();
    return result as unknown as Product[];
  }

  /** BSSR: Create New Product **/
  public async createNewProduct(input: ProductInput): Promise<Product> {
    try {
      const result = await this.productModel.create(input);
      return (result as any).toJSON() as Product;
    } catch (err) {
      console.error("Error, createNewProduct:", err);
      throw new Errors(HTTPCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  /** BSSR: Update Product by ID **/
  public async updateChosenProduct(
    id: string,
    input: ProductInput
  ): Promise<Product> {
    id = shapeIntoMongooseObjectId(id);
    const result = await this.productModel
      .findByIdAndUpdate({ _id: id }, input, { new: true })
      .exec();
    if (!result) throw new Errors(HTTPCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return (result as any).toJSON() as Product;
  }
}

export default ProductService;
