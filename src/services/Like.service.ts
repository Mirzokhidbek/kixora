import ProductLikeModel from "../models/ProductLike.model";
import ProductModel from "../models/Product.model";
import { AuthPayload } from "../libs/types/member";
import { Product } from "../libs/types/product";
import { ProductStatus } from "../libs/enums/product.enum";
import Errors, { HTTPCode, Message } from "../libs/Errors";
import { shapeIntoMongooseObjectId } from "../libs/config";

const MAX_LIKES_RETURNED = 100;

class LikeService {
  private readonly likeModel = ProductLikeModel;
  private readonly productModel = ProductModel;

  /**
   * Idempotent like: the unique (member, product) index makes repeated or
   * concurrent likes count once, and the counter only moves when a row is created.
   */
  public async likeProduct(member: AuthPayload, productIdRaw: string): Promise<{ liked: true; productLikes: number }> {
    const productId = shapeIntoMongooseObjectId(productIdRaw);
    const exists = await this.productModel.exists({ _id: productId, productStatus: ProductStatus.PROCESS });
    if (!exists) throw new Errors(HTTPCode.NOT_FOUND, Message.NO_DATA_FOUND);

    const res = await this.likeModel
      .updateOne(
        { memberId: shapeIntoMongooseObjectId(member._id), productId },
        { $setOnInsert: { memberId: shapeIntoMongooseObjectId(member._id), productId } },
        { upsert: true }
      )
      .exec();
    if (res.upsertedCount === 1) {
      await this.productModel.updateOne({ _id: productId }, { $inc: { productLikes: 1 } }).exec();
    }
    return { liked: true, productLikes: await this.countFor(productId) };
  }

  /** Idempotent unlike: the counter only moves when a row was actually removed */
  public async unlikeProduct(member: AuthPayload, productIdRaw: string): Promise<{ liked: false; productLikes: number }> {
    const productId = shapeIntoMongooseObjectId(productIdRaw);
    const res = await this.likeModel
      .deleteOne({ memberId: shapeIntoMongooseObjectId(member._id), productId })
      .exec();
    if (res.deletedCount === 1) {
      await this.productModel
        .updateOne({ _id: productId, productLikes: { $gt: 0 } }, { $inc: { productLikes: -1 } })
        .exec();
    }
    return { liked: false, productLikes: await this.countFor(productId) };
  }

  /** Liked products with CURRENT catalog data (price, images, stock), newest like first */
  public async getLikedProducts(member: AuthPayload): Promise<Product[]> {
    const likes = await this.likeModel
      .find({ memberId: shapeIntoMongooseObjectId(member._id) })
      .sort({ createdAt: -1 })
      .limit(MAX_LIKES_RETURNED)
      .select("productId")
      .lean<{ productId: unknown }[]>()
      .exec();
    if (!likes.length) return [];

    const products = await this.productModel
      .find({ _id: { $in: likes.map((l) => l.productId) }, productStatus: ProductStatus.PROCESS })
      .lean<Product[]>()
      .exec();
    const byId = new Map(products.map((p) => [String(p._id), p]));
    // keep like order; products that were removed from the catalog drop out
    return likes.map((l) => byId.get(String(l.productId))).filter((p): p is Product => Boolean(p));
  }

  /** Merges a guest's local wishlist into the account after sign-in */
  public async syncLikes(member: AuthPayload, productIds: string[]): Promise<Product[]> {
    for (const id of [...new Set(productIds)]) {
      await this.likeProduct(member, id).catch(() => undefined); // skip unknown/removed products
    }
    return this.getLikedProducts(member);
  }

  public async isLiked(memberId: string, productId: unknown): Promise<boolean> {
    return Boolean(
      await this.likeModel.exists({ memberId: shapeIntoMongooseObjectId(memberId), productId })
    );
  }

  private async countFor(productId: unknown): Promise<number> {
    const p = await this.productModel.findById(productId).select("productLikes").lean<{ productLikes?: number }>().exec();
    return p?.productLikes || 0;
  }
}

export default LikeService;
