export type ReviewStatus = "VISIBLE" | "HIDDEN";

export interface ProductReview {
  _id: string;
  productId: string;
  memberId: string;
  reviewRating: number;
  reviewComment: string;
  reviewStatus?: ReviewStatus;
  adminReply?: string;
  createdAt: string;
  updatedAt: string;
  memberData?: { memberNick: string; memberImage?: string };
}

export interface ReviewSummary {
  ratingAvg: number;
  reviewCount: number;
  /** index 0 = 1 star ... index 4 = 5 stars */
  distribution: number[];
}

export interface ProductReviewsPage {
  reviews: ProductReview[];
  total: number;
  page: number;
  limit: number;
  summary: ReviewSummary;
}

export interface MyReviewState {
  review: ProductReview | null;
  canReview: boolean;
}

export interface ReviewInput {
  reviewRating: number;
  reviewComment: string;
}
