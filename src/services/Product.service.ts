import ProductModel from "../schema/Product.model";
import {
  AISearchResponse,
  Product,
  ProductDashboardMetrics,
  ProductInput,
  ProductInquiry,
  ProductUpdateInput,
} from "../libs/types/product";
import Errors, { HTTPCode, Message } from "../libs/Errors";
import { shapeIntoMongooseObjectId } from "../libs/config";
import { ProductCollection, ProductStatus } from "../libs/enums/product.enum";
import { T } from "../libs/types/common";
import { Types } from "mongoose";
import ViewService from "./View.service";
import { ViewInput } from "../libs/types/view";
import { ViewGroup } from "../libs/enums/view.enum";
import { extractAISearchIntent } from "../libs/aiSearch";


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

    if (inquiry.size) {
      match.productSizes = { $in: [Number(inquiry.size)] };
    }

    if (inquiry.color) {
      match.productColors = { $in: [String(inquiry.color)] };
    }

    const sort: T =
      inquiry.order === "productPrice"
        ? { [inquiry.order]: 1 }
        : { [inquiry.order || "createdAt"]: -1 };

    const result = await this.productModel
      .aggregate<Product>([
        { $match: match },
        { $sort: sort },
        { $skip: (inquiry.page * 1 - 1) * inquiry.limit },
        { $limit: inquiry.limit * 1 },
      ])
      .exec();

    if (!result) throw new Errors(HTTPCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  /** SPA: Get Single Product & Track Member Views **/
  public async getProduct(
    memberId: Types.ObjectId | undefined,
    id: string
  ): Promise<Product> {
    const productId = shapeIntoMongooseObjectId(id);

    const foundProduct = await this.productModel
      .findOne({ _id: productId, productStatus: ProductStatus.PROCESS })
      .lean<Product>()
      .exec();

    if (!foundProduct) throw new Errors(HTTPCode.NOT_FOUND, Message.NO_DATA_FOUND);

    let result: Product = foundProduct;

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
        const updated = await this.productModel
          .findByIdAndUpdate(
            productId,
            { $inc: { productViews: 1 } },
            { new: true }
          )
          .lean<Product>()
          .exec();

        if (updated) {
          result = updated;
        }
      }
    }

    return result;
  }

  /** SPA & BSSR: Get All Products **/
  public async getAllProducts(): Promise<Product[]> {
    const result = await this.productModel.find().lean<Product[]>().exec();
    return result || [];
  }

  /** BSSR: Create New Product **/
  public async createNewProduct(input: ProductInput): Promise<Product> {
    try {
      const result = await this.productModel.create(input);
      return result.toObject() as Product;
    } catch (err) {
      console.error("Error, createNewProduct:", err);
      throw new Errors(HTTPCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  /** BSSR: Update Product by ID **/
  public async updateChosenProduct(
    id: string,
    input: Partial<ProductUpdateInput>
  ): Promise<Product> {
    const productId = shapeIntoMongooseObjectId(id);
    const result = await this.productModel
      .findByIdAndUpdate({ _id: productId }, input, { new: true })
      .lean<Product>()
      .exec();
    if (!result) throw new Errors(HTTPCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  /** BSSR: Update Product Details via AJAX (Quick Edit) **/
  public async updateProductDetailsByAdmin(
    id: string,
    input: Partial<ProductUpdateInput>
  ): Promise<Product> {
    const productId = shapeIntoMongooseObjectId(id);
    const result = await this.productModel
      .findByIdAndUpdate(productId, { $set: input }, { new: true })
      .lean<Product>()
      .exec();
    if (!result) throw new Errors(HTTPCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    return result;
  }

  /** BSSR: Get Footwear Catalog Metrics (Total Models, Low Stock, Collection Counts) **/
  public async getProductDashboardMetrics(): Promise<ProductDashboardMetrics> {
    const products = await this.productModel.find().lean<Product[]>().exec();
    let activeProducts = 0;
    let lowStockCount = 0;
    const categoryBreakdown: Record<string, number> = {};

    products.forEach((p: Product) => {
      if (p.productStatus === ProductStatus.PROCESS) activeProducts++;
      if (Number(p.productLeftCount || 0) <= 5) lowStockCount++;
      const col = p.productCollection || "SNEAKERS";
      categoryBreakdown[col] = (categoryBreakdown[col] || 0) + 1;
    });

    return {
      totalProducts: products.length,
      activeProducts,
      lowStockCount,
      categoryBreakdown,
    };
  }

  /** SPA: AI Semantic Natural Language Search via Gemini AI **/
  public async aiSearchProducts(query: string): Promise<AISearchResponse> {
    if (!query || !query.trim()) {
      throw new Errors(HTTPCode.BAD_REQUEST, Message.BLANK_NOT_ALLOWED);
    }

    // Direct Gemini AI Extraction (zero fallback)
    const intent = await extractAISearchIntent(query.trim());

    // Build MongoDB Semantic Query
    const matchConditions: T[] = [
      { productStatus: ProductStatus.PROCESS }
    ];

    const orClauses: T[] = [];

    // Match Collection if extracted
    if (intent.collection) {
      orClauses.push({ productCollection: intent.collection });
    }

    // Match Color if extracted
    if (intent.color) {
      orClauses.push({
        productColors: { $regex: new RegExp(intent.color, "i") }
      });
      orClauses.push({
        productName: { $regex: new RegExp(intent.color, "i") }
      });
    }

    // Match extracted English/Uzbek keywords in title and description
    if (intent.keywords && intent.keywords.length > 0) {
      intent.keywords.forEach((keyword) => {
        if (keyword && keyword.trim().length > 2) {
          orClauses.push({
            productName: { $regex: new RegExp(keyword.trim(), "i") }
          });
          orClauses.push({
            productDesc: { $regex: new RegExp(keyword.trim(), "i") }
          });
        }
      });
    }

    let finalQuery: T = { productStatus: ProductStatus.PROCESS };
    if (orClauses.length > 0) {
      finalQuery = {
        $and: [
          { productStatus: ProductStatus.PROCESS },
          { $or: orClauses }
        ]
      };
    }

    let products = await this.productModel
      .find(finalQuery)
      .sort({ productViews: -1, createdAt: -1 })
      .limit(12)
      .lean<Product[]>()
      .exec();

    // If query returned no products (e.g. database has few items), retrieve closest active models
    if (!products || products.length === 0) {
      products = await this.productModel
        .find({ productStatus: ProductStatus.PROCESS })
        .sort({ productViews: -1 })
        .limit(6)
        .lean<Product[]>()
        .exec();
    }

    return {
      query: query.trim(),
      intent: {
        collection: intent.collection as ProductCollection | null,
        color: intent.color,
        keywords: intent.keywords || [],
        recommendation: intent.recommendation,
      },
      products: products || [],
    };
  }
}

export default ProductService;

