import { Request, Response } from "express";
import { HTTPCode } from "../libs/Errors";
import LikeService from "../services/Like.service";
import ReviewService from "../services/Review.service";
import { likeSyncSchema, parse, reviewListSchema, reviewSaveSchema } from "../libs/validation";

const likeService = new LikeService();
const reviewService = new ReviewService();

/** SPA: product likes (wishlist) and verified-buyer reviews */
const engagementController = {
  // ---------- Likes ----------
  getLikedProducts: async (req: Request, res: Response) => {
    res.status(HTTPCode.OK).json(await likeService.getLikedProducts(req.member!));
  },

  likeProduct: async (req: Request, res: Response) => {
    res.status(HTTPCode.OK).json(await likeService.likeProduct(req.member!, String(req.params.id)));
  },

  unlikeProduct: async (req: Request, res: Response) => {
    res.status(HTTPCode.OK).json(await likeService.unlikeProduct(req.member!, String(req.params.id)));
  },

  /** Merges the guest (localStorage) wishlist into the account after sign-in */
  syncLikes: async (req: Request, res: Response) => {
    const { productIds } = parse(likeSyncSchema, req.body);
    res.status(HTTPCode.OK).json(await likeService.syncLikes(req.member!, productIds));
  },

  // ---------- Reviews ----------
  getProductReviews: async (req: Request, res: Response) => {
    const { page, limit } = parse(reviewListSchema, req.query);
    res.status(HTTPCode.OK).json(await reviewService.getProductReviews(String(req.params.id), page, limit));
  },

  getMyReview: async (req: Request, res: Response) => {
    res.status(HTTPCode.OK).json(await reviewService.getMyReview(req.member!, String(req.params.id)));
  },

  saveMyReview: async (req: Request, res: Response) => {
    const input = parse(reviewSaveSchema, req.body);
    res.status(HTTPCode.OK).json(await reviewService.saveReview(req.member!, String(req.params.id), input));
  },

  deleteMyReview: async (req: Request, res: Response) => {
    res.status(HTTPCode.OK).json(await reviewService.deleteMyReview(req.member!, String(req.params.id)));
  },
};

export default engagementController;
