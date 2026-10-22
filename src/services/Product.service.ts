import fs from "fs/promises";
import ProductModel from "../models/Product.model";
import { resolveStoredPath } from "../libs/uploader";
import { AISearchResponse, Product, ProductDashboardMetrics } from "../libs/types/product";
import Errors, { HTTPCode, Message } from "../libs/Errors";
import { escapeRegex, shapeIntoMongooseObjectId } from "../libs/config";
import { ProductCollection, ProductStatus } from "../libs/enums/product.enum";
import { T } from "../libs/types/common";
import { Types } from "mongoose";
import ViewService from "./View.service";
import ProductLikeModel from "../models/ProductLike.model";
import { ViewGroup } from "../libs/enums/view.enum";
import { extractAISearchIntent } from "../libs/aiSearch";
import { z } from "zod";
import { productCreateSchema, productInquirySchema, productUpdateSchema } from "../libs/validation";

type ProductInquiry = z.infer<typeof productInquirySchema>;
type ProductCreate = z.infer<typeof productCreateSchema> & { productImages: string[] };
type ProductUpdate = z.infer<typeof productUpdateSchema>;

const LOW_STOCK_THRESHOLD = 5;

/** Deletes product upload files by exact stored path; never touches anything else */
async function removeUploads(images: string[]) {
  await Promise.all(
    images
      .filter((img) => img.startsWith("public/uploads/products/"))
      .map((img) => resolveStoredPath(img))
      .filter((file): file is string => Boolean(file))
      .map((file) =>
        fs.unlink(file).catch((err) => {
          if (err.code !== "ENOENT") console.error("Failed to remove upload:", file, err.message);
        })
      )
  );
}

class ProductService {
  private readonly productModel = ProductModel;
  private readonly viewService = new ViewService();

  /** SPA: Get Products with filters, search, sorting & pagination **/
  public async getProducts(inquiry: ProductInquiry): Promise<{ products: Product[]; total: number }> {
    const match: T = { productStatus: ProductStatus.PROCESS };
    if (inquiry.productCollection) match.productCollection = inquiry.productCollection;
    if (inquiry.search) match.productName = { $regex: escapeRegex(inquiry.search), $options: "i" };
    if (inquiry.size) match.productSizes = inquiry.size;
    if (inquiry.color) match.productColors = inquiry.color;

    // order is whitelisted by the validation schema
    const sort: Record<string, 1 | -1> =
      inquiry.order === "productPrice" ? { productPrice: 1 } : { [inquiry.order]: -1 };

    const [products, total] = await Promise.all([
      this.productModel
        .find(match)
        .sort({ ...sort, _id: -1 })
        .skip((inquiry.page - 1) * inquiry.limit)
        .limit(inquiry.limit)
        .lean<Product[]>()
        .exec(),
      this.productModel.countDocuments(match).exec(),
    ]);
    return { products, total };
  }

  /** SPA: Get Single Product & track unique member views **/
  public async getProduct(memberId: Types.ObjectId | undefined, id: string): Promise<Product> {
    const productId = shapeIntoMongooseObjectId(id);
    const foundProduct = await this.productModel
      .findOne({ _id: productId, productStatus: ProductStatus.PROCESS })
      .lean<Product>()
      .exec();
    if (!foundProduct) throw new Errors(HTTPCode.NOT_FOUND, Message.NO_DATA_FOUND);

    let result = foundProduct;
    if (memberId) {
      const isNewView = await this.viewService.recordView({
        memberId,
        viewRefId: productId,
        viewGroup: ViewGroup.PRODUCT,
      });
      if (isNewView) {
        const updated = await this.productModel
          .findByIdAndUpdate(productId, { $inc: { productViews: 1 } }, { new: true })
          .lean<Product>()
          .exec();
        if (updated) result = updated;
      }
      const meLiked = Boolean(await ProductLikeModel.exists({ memberId, productId }));
      return { ...result, meLiked };
    }
    return result;
  }

  /** BSSR: Paginated product list for admin **/
  public async getAllProducts(page: number, limit: number): Promise<{ products: Product[]; total: number }> {
    const filter = { productStatus: { $ne: ProductStatus.DELETE } };
    const [products, total] = await Promise.all([
      this.productModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<Product[]>()
        .exec(),
      this.productModel.countDocuments(filter).exec(),
    ]);
    return { products, total };
  }

  /** BSSR: Create New Product (validated, whitelisted input) **/
  public async createNewProduct(input: ProductCreate): Promise<Product> {
    const result = await this.productModel.create(input);
    return result.toObject() as Product;
  }

  /** BSSR: Update Product by ID (validated, whitelisted input) **/
  public async updateChosenProduct(id: string, input: ProductUpdate): Promise<Product> {
    const result = await this.productModel
      .findByIdAndUpdate(shapeIntoMongooseObjectId(id), { $set: input }, { new: true, runValidators: true })
      .lean<Product>()
      .exec();
    if (!result) throw new Errors(HTTPCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  /**
   * BSSR: Replace a product's images.
   * Old files are removed only when they are this product's own uploads and no
   * other product references them; a missing old file is not an error.
   */
  public async replaceProductImages(id: string, newImages: string[]): Promise<Product> {
    const productId = shapeIntoMongooseObjectId(id);
    const before = await this.productModel.findById(productId).select("productImages").lean<Product>().exec();
    if (!before) {
      await removeUploads(newImages); // nothing to attach them to
      throw new Errors(HTTPCode.NOT_FOUND, Message.NO_DATA_FOUND);
    }

    const result = await this.productModel
      .findByIdAndUpdate(productId, { $set: { productImages: newImages } }, { new: true })
      .lean<Product>()
      .exec();

    const stale = (before.productImages || []).filter((img) => !newImages.includes(img));
    const stillUsed = await this.productModel
      .find({ productImages: { $in: stale } })
      .distinct("productImages")
      .exec();
    await removeUploads(stale.filter((img) => !stillUsed.includes(img)));

    return result!;
  }

  /** BSSR: Catalog metrics computed inside MongoDB **/
  public async getProductDashboardMetrics(): Promise<ProductDashboardMetrics> {
    const [facet] = await this.productModel
      .aggregate<{
        total: { n: number }[];
        active: { n: number }[];
        lowStock: { n: number }[];
        byCollection: { _id: string; n: number }[];
      }>([
        { $match: { productStatus: { $ne: ProductStatus.DELETE } } },
        {
          $facet: {
            total: [{ $count: "n" }],
            active: [{ $match: { productStatus: ProductStatus.PROCESS } }, { $count: "n" }],
            lowStock: [{ $match: { productLeftCount: { $lte: LOW_STOCK_THRESHOLD } } }, { $count: "n" }],
            byCollection: [{ $group: { _id: "$productCollection", n: { $sum: 1 } } }],
          },
        },
      ])
      .exec();

    const categoryBreakdown: Record<string, number> = {};
    facet?.byCollection.forEach((c) => (categoryBreakdown[c._id || "SNEAKERS"] = c.n));
    return {
      totalProducts: facet?.total[0]?.n || 0,
      activeProducts: facet?.active[0]?.n || 0,
      lowStockCount: facet?.lowStock[0]?.n || 0,
      categoryBreakdown,
    };
  }

  /** SPA: AI natural-language search via Gemini **/
  public async aiSearchProducts(query: string): Promise<AISearchResponse> {
    const intent = await extractAISearchIntent(query);

    const orClauses: T[] = [];
    if (intent.collection) orClauses.push({ productCollection: intent.collection });
    if (intent.color) {
      const color = { $regex: escapeRegex(intent.color), $options: "i" };
      orClauses.push({ productColors: color }, { productName: color });
    }
    intent.keywords
      .filter((k) => k.trim().length > 2)
      .forEach((keyword) => {
        const kw = { $regex: escapeRegex(keyword.trim()), $options: "i" };
        orClauses.push({ productName: kw }, { productDesc: kw });
      });

    const finalQuery: T = orClauses.length
      ? { productStatus: ProductStatus.PROCESS, $or: orClauses }
      : { productStatus: ProductStatus.PROCESS };

    let products = await this.productModel
      .find(finalQuery)
      .sort({ productViews: -1, createdAt: -1 })
      .limit(12)
      .lean<Product[]>()
      .exec();

    // Nothing matched: show the most popular active models instead of an empty page
    if (products.length === 0) {
      products = await this.productModel
        .find({ productStatus: ProductStatus.PROCESS })
        .sort({ productViews: -1 })
        .limit(6)
        .lean<Product[]>()
        .exec();
    }

    return {
      query,
      intent: {
        collection: intent.collection as ProductCollection | null,
        color: intent.color,
        keywords: intent.keywords,
        recommendation: intent.recommendation,
      },
      products,
    };
  }
}

export default ProductService;
