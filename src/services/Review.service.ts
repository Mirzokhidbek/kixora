import { Types } from "mongoose";
import ProductReviewModel from "../models/ProductReview.model";
import ProductModel from "../models/Product.model";
import OrderModel from "../models/Order.model";
import OrderItemModel from "../models/OrderItem.model";
import { AuthPayload } from "../libs/types/member";
import { ProductReview, ReviewSummary } from "../libs/types/review";
import { ReviewStatus } from "../libs/enums/review.enum";
import { OrderStatus } from "../libs/enums/order.enum";
import { ProductStatus } from "../libs/enums/product.enum";
import Errors, { HTTPCode, Message } from "../libs/Errors";
import { shapeIntoMongooseObjectId } from "../libs/config";
import { z } from "zod";
import { reviewSaveSchema } from "../libs/validation";

type ReviewInput = z.infer<typeof reviewSaveSchema>;

const memberLookup = {
  $lookup: {
    from: "members",
    localField: "memberId",
    foreignField: "_id",
    as: "memberData",
    pipeline: [{ $project: { _id: 0, memberNick: 1, memberImage: 1 } }],
  },
};

class ReviewService {
  private readonly reviewModel = ProductReviewModel;
  private readonly productModel = ProductModel;
  private readonly orderModel = OrderModel;
  private readonly orderItemModel = OrderItemModel;

  /** Verified buyer = has a FINISHED (received) order containing this product */
  public async hasPurchased(memberId: Types.ObjectId, productId: Types.ObjectId): Promise<boolean> {
    const finishedOrderIds = await this.orderModel
      .find({ memberId, orderStatus: OrderStatus.FINISH })
      .distinct("_id")
      .exec();
    if (!finishedOrderIds.length) return false;
    return Boolean(await this.orderItemModel.exists({ orderId: { $in: finishedOrderIds }, productId }));
  }

  /** Public: visible reviews of a product, newest first */
  public async getProductReviews(productIdRaw: string, page: number, limit: number) {
    const productId = shapeIntoMongooseObjectId(productIdRaw);
    const filter = { productId, reviewStatus: ReviewStatus.VISIBLE };
    const [reviews, total, summary] = await Promise.all([
      this.reviewModel
        .aggregate<ProductReview>([
          { $match: filter },
          { $sort: { createdAt: -1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit },
          memberLookup,
          { $unwind: { path: "$memberData", preserveNullAndEmptyArrays: true } },
          { $project: { reviewStatus: 0 } },
        ])
        .exec(),
      this.reviewModel.countDocuments(filter).exec(),
      this.getSummary(productId),
    ]);
    return { reviews, total, page, limit, summary };
  }

  /** Signed-in member: own review (any status) + whether they may write one */
  public async getMyReview(member: AuthPayload, productIdRaw: string) {
    const productId = shapeIntoMongooseObjectId(productIdRaw);
    const memberId = shapeIntoMongooseObjectId(member._id);
    const [review, canReview] = await Promise.all([
      this.reviewModel.findOne({ memberId, productId }).lean<ProductReview>().exec(),
      this.hasPurchased(memberId, productId),
    ]);
    return { review, canReview };
  }

  /** Create or edit own review. Editing a hidden review keeps it hidden. */
  public async saveReview(member: AuthPayload, productIdRaw: string, input: ReviewInput): Promise<ProductReview> {
    const productId = shapeIntoMongooseObjectId(productIdRaw);
    const memberId = shapeIntoMongooseObjectId(member._id);

    const product = await this.productModel.exists({ _id: productId, productStatus: { $ne: ProductStatus.DELETE } });
    if (!product) throw new Errors(HTTPCode.NOT_FOUND, Message.NO_DATA_FOUND);
    if (!(await this.hasPurchased(memberId, productId))) {
      throw new Errors(HTTPCode.FORBIDDEN, Message.REVIEW_NOT_ALLOWED);
    }

    const review = await this.reviewModel
      .findOneAndUpdate(
        { memberId, productId },
        {
          $set: { reviewRating: input.reviewRating, reviewComment: input.reviewComment },
          $setOnInsert: { memberId, productId, reviewStatus: ReviewStatus.VISIBLE, adminReply: "" },
        },
        { upsert: true, new: true, runValidators: true }
      )
      .lean<ProductReview>()
      .exec();
    await this.recomputeRating(productId);
    return review!;
  }

  public async deleteMyReview(member: AuthPayload, productIdRaw: string): Promise<{ deleted: boolean }> {
    const productId = shapeIntoMongooseObjectId(productIdRaw);
    const res = await this.reviewModel
      .deleteOne({ memberId: shapeIntoMongooseObjectId(member._id), productId })
      .exec();
    if (res.deletedCount) await this.recomputeRating(productId);
    return { deleted: res.deletedCount === 1 };
  }

  // ---------- Admin moderation ----------
  public async getReviewsByAdmin(page: number, limit: number, status?: ReviewStatus) {
    const filter = status ? { reviewStatus: status } : {};
    const [reviews, total, counts] = await Promise.all([
      this.reviewModel
        .aggregate<ProductReview>([
          { $match: filter },
          { $sort: { createdAt: -1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit },
          memberLookup,
          { $unwind: { path: "$memberData", preserveNullAndEmptyArrays: true } },
          {
            $lookup: {
              from: "products",
              localField: "productId",
              foreignField: "_id",
              as: "productData",
              pipeline: [{ $project: { _id: 0, productName: 1, productImages: 1 } }],
            },
          },
          { $unwind: { path: "$productData", preserveNullAndEmptyArrays: true } },
        ])
        .exec(),
      this.reviewModel.countDocuments(filter).exec(),
      this.reviewModel.aggregate<{ _id: ReviewStatus; n: number }>([{ $group: { _id: "$reviewStatus", n: { $sum: 1 } } }]).exec(),
    ]);
    const statusCounts = {
      ALL: counts.reduce((a, c) => a + c.n, 0),
      VISIBLE: counts.find((c) => c._id === ReviewStatus.VISIBLE)?.n || 0,
      HIDDEN: counts.find((c) => c._id === ReviewStatus.HIDDEN)?.n || 0,
    };
    return { reviews, total, statusCounts };
  }

  public async setReviewStatus(reviewIdRaw: string, reviewStatus: ReviewStatus): Promise<ProductReview> {
    const review = await this.reviewModel
      .findByIdAndUpdate(shapeIntoMongooseObjectId(reviewIdRaw), { $set: { reviewStatus } }, { new: true })
      .lean<ProductReview>()
      .exec();
    if (!review) throw new Errors(HTTPCode.NOT_FOUND, Message.NO_DATA_FOUND);
    await this.recomputeRating(review.productId);
    return review;
  }

  public async replyToReview(reviewIdRaw: string, adminReply: string): Promise<ProductReview> {
    const review = await this.reviewModel
      .findByIdAndUpdate(shapeIntoMongooseObjectId(reviewIdRaw), { $set: { adminReply } }, { new: true })
      .lean<ProductReview>()
      .exec();
    if (!review) throw new Errors(HTTPCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return review;
  }

  public async deleteReviewByAdmin(reviewIdRaw: string): Promise<{ deleted: boolean }> {
    const review = await this.reviewModel
      .findByIdAndDelete(shapeIntoMongooseObjectId(reviewIdRaw))
      .lean<ProductReview>()
      .exec();
    if (!review) throw new Errors(HTTPCode.NOT_FOUND, Message.NO_DATA_FOUND);
    await this.recomputeRating(review.productId);
    return { deleted: true };
  }

  // ---------- Aggregates ----------
  private async getSummary(productId: Types.ObjectId): Promise<ReviewSummary> {
    const rows = await this.reviewModel
      .aggregate<{ _id: number; n: number }>([
        { $match: { productId, reviewStatus: ReviewStatus.VISIBLE } },
        { $group: { _id: "$reviewRating", n: { $sum: 1 } } },
      ])
      .exec();
    const distribution = [1, 2, 3, 4, 5].map((star) => rows.find((r) => r._id === star)?.n || 0);
    const reviewCount = distribution.reduce((a, n) => a + n, 0);
    const sum = distribution.reduce((a, n, i) => a + n * (i + 1), 0);
    return { ratingAvg: reviewCount ? Math.round((sum / reviewCount) * 10) / 10 : 0, reviewCount, distribution };
  }

  /** Keeps Product.ratingAvg / reviewCount in sync with VISIBLE reviews */
  private async recomputeRating(productId: Types.ObjectId): Promise<void> {
    const { ratingAvg, reviewCount } = await this.getSummary(productId);
    await this.productModel.updateOne({ _id: productId }, { $set: { ratingAvg, reviewCount } }).exec();
  }
}

export default ReviewService;
