/**
 * ProductReviews.tsx - verified-buyer reviews for one product.
 * Shows the real rating summary, the member's own review form (only for
 * customers who received the product) and the paginated public list.
 */
import { useCallback, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  LinearProgress,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import ProductService from "../../services/ProductService";
import { useGlobals } from "../../hooks/useGlobals";
import { getImageUrl } from "../../../lib/config";
import { sweetErrorAlert, sweetTopSmallSuccessAlert } from "../../../lib/sweetAlert";
import type { MyReviewState, ProductReview, ReviewSummary } from "../../../lib/types/review";

const PAGE_SIZE = 5;
const productService = new ProductService();

interface ProductReviewsProps {
  productId: string;
  /** Lets the page header show the up-to-date rating after the member saves a review */
  onSummaryChange?: (summary: ReviewSummary) => void;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export function ProductReviews({ productId, onSummaryChange }: ProductReviewsProps) {
  const { authMember } = useGlobals();

  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [mine, setMine] = useState<MyReviewState | null>(null);
  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState<number | null>(5);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  const loadPage = useCallback(
    async (nextPage: number) => {
      setLoading(true);
      try {
        const data = await productService.getReviews(productId, nextPage, PAGE_SIZE);
        setReviews((prev) => (nextPage === 1 ? data.reviews : [...prev, ...data.reviews]));
        setTotal(data.total);
        setSummary(data.summary);
        setPage(nextPage);
        onSummaryChange?.(data.summary);
      } catch (err) {
        console.log("Error loading reviews:", err);
      } finally {
        setLoading(false);
      }
    },
    [productId, onSummaryChange]
  );

  const loadMine = useCallback(async () => {
    if (!authMember) {
      setMine(null);
      return;
    }
    try {
      const data = await productService.getMyReview(productId);
      setMine(data);
      if (data.review) {
        setRating(data.review.reviewRating);
        setComment(data.review.reviewComment);
      }
    } catch {
      setMine(null);
    }
  }, [authMember, productId]);

  useEffect(() => {
    void loadPage(1);
  }, [loadPage]);

  useEffect(() => {
    void loadMine();
  }, [loadMine]);

  const handleSave = async () => {
    if (!rating) return sweetErrorAlert("Please choose a star rating.");
    if (comment.trim().length < 3) return sweetErrorAlert("Please write at least a few words.");
    setSaving(true);
    try {
      await productService.saveMyReview(productId, { reviewRating: rating, reviewComment: comment.trim() });
      sweetTopSmallSuccessAlert("Thank you! Your review is saved.");
      setEditing(false);
      await Promise.all([loadMine(), loadPage(1)]);
    } catch (err: any) {
      sweetErrorAlert(err?.response?.data?.message || "Could not save your review.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete your review?")) return;
    try {
      await productService.deleteMyReview(productId);
      setComment("");
      setRating(5);
      await Promise.all([loadMine(), loadPage(1)]);
    } catch (err: any) {
      sweetErrorAlert(err?.response?.data?.message || "Could not delete your review.");
    }
  };

  const reviewCount = summary?.reviewCount || 0;

  // ---------- Member box ----------
  const renderMemberBox = () => {
    if (!authMember) {
      return (
        <Typography variant="body2" sx={{ color: "#6b7280" }}>
          Sign in to write a review. Reviews are open to customers who received this product.
        </Typography>
      );
    }
    if (!mine) return null;

    const ownReview = mine.review;
    if (ownReview && !editing) {
      return (
        <Box sx={{ p: 2, borderRadius: 2, bgcolor: "#f9fafb", border: "1px solid #e5e7eb" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Your review</Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button size="small" onClick={() => setEditing(true)} sx={{ fontWeight: 700, color: "#111827" }}>
                Edit
              </Button>
              <Button size="small" color="error" onClick={handleDelete} sx={{ fontWeight: 700 }}>
                Delete
              </Button>
            </Box>
          </Box>
          <Rating value={ownReview.reviewRating} readOnly size="small" />
          <Typography variant="body2" sx={{ color: "#374151", mt: 0.5, whiteSpace: "pre-line" }}>
            {ownReview.reviewComment}
          </Typography>
          {ownReview.reviewStatus === "HIDDEN" && (
            <Typography variant="caption" sx={{ color: "#b45309", display: "block", mt: 1 }}>
              This review was hidden by the store moderators and is not shown publicly.
            </Typography>
          )}
        </Box>
      );
    }

    if (!mine.canReview && !ownReview) {
      return (
        <Typography variant="body2" sx={{ color: "#6b7280" }}>
          Only customers who received this product can review it.
        </Typography>
      );
    }

    return (
      <Box sx={{ p: 2, borderRadius: 2, border: "1px solid #e5e7eb" }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
          {ownReview ? "Edit your review" : "Write a review"}
        </Typography>
        <Rating value={rating} onChange={(_, v) => setRating(v)} />
        <TextField
          fullWidth
          multiline
          minRows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="How do they fit? How is the comfort and quality?"
          slotProps={{ htmlInput: { maxLength: 1000 } }}
          sx={{ mt: 1 }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
          <Typography variant="caption" sx={{ color: "#9ca3af" }}>{comment.length}/1000</Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {ownReview && (
              <Button onClick={() => setEditing(false)} sx={{ fontWeight: 700, color: "#6b7280" }}>
                Cancel
              </Button>
            )}
            <Button
              variant="contained"
              disabled={saving}
              onClick={handleSave}
              sx={{ bgcolor: "#000", fontWeight: 800, borderRadius: 9999, px: 3, "&:hover": { bgcolor: "#111827" } }}
            >
              {saving ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : "Submit"}
            </Button>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ maxWidth: 820 }}>
      {/* Summary */}
      <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center", mb: 3 }}>
        <Box sx={{ textAlign: "center", minWidth: 120 }}>
          <Typography sx={{ fontSize: "2.6rem", fontWeight: 900, lineHeight: 1 }}>
            {reviewCount ? summary!.ratingAvg.toFixed(1) : "–"}
          </Typography>
          <Rating value={summary?.ratingAvg || 0} precision={0.1} readOnly size="small" />
          <Typography variant="caption" sx={{ display: "block", color: "#6b7280", fontWeight: 700 }}>
            {reviewCount ? `${reviewCount} review${reviewCount === 1 ? "" : "s"}` : "No reviews yet"}
          </Typography>
        </Box>
        <Box sx={{ flex: 1, minWidth: 220 }}>
          {[5, 4, 3, 2, 1].map((star) => {
            const n = summary?.distribution[star - 1] || 0;
            return (
              <Box key={star} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                <Typography variant="caption" sx={{ width: 14, fontWeight: 700 }}>{star}</Typography>
                <LinearProgress
                  variant="determinate"
                  value={reviewCount ? (n / reviewCount) * 100 : 0}
                  sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: "#f3f4f6", "& .MuiLinearProgress-bar": { bgcolor: "#f59e0b" } }}
                />
                <Typography variant="caption" sx={{ width: 24, color: "#6b7280" }}>{n}</Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {renderMemberBox()}

      <Divider sx={{ my: 3 }} />

      {/* List */}
      {reviews.map((r) => (
        <Box key={r._id} sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
            <Avatar src={r.memberData?.memberImage ? getImageUrl(r.memberData.memberImage) : undefined} sx={{ width: 32, height: 32, fontSize: "0.9rem" }}>
              {r.memberData?.memberNick?.charAt(0).toUpperCase() || "?"}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                {r.memberData?.memberNick || "Customer"}
                <Typography component="span" variant="caption" sx={{ ml: 1, color: "#059669", fontWeight: 700 }}>
                  ✓ Verified buyer
                </Typography>
              </Typography>
              <Typography variant="caption" sx={{ color: "#9ca3af" }}>{formatDate(r.createdAt)}</Typography>
            </Box>
          </Box>
          <Rating value={r.reviewRating} readOnly size="small" />
          {/* Plain text rendering: React escapes user content */}
          <Typography variant="body2" sx={{ color: "#374151", whiteSpace: "pre-line" }}>{r.reviewComment}</Typography>
          {r.adminReply && (
            <Box sx={{ mt: 1, ml: 2, pl: 1.5, borderLeft: "3px solid #111827" }}>
              <Typography variant="caption" sx={{ fontWeight: 800 }}>KIXORA replied</Typography>
              <Typography variant="body2" sx={{ color: "#4b5563", whiteSpace: "pre-line" }}>{r.adminReply}</Typography>
            </Box>
          )}
        </Box>
      ))}

      {loading && <CircularProgress size={24} sx={{ color: "#111827" }} />}
      {!loading && reviews.length < total && (
        <Button onClick={() => loadPage(page + 1)} sx={{ fontWeight: 800, color: "#111827" }}>
          Show more reviews
        </Button>
      )}
    </Box>
  );
}

export default ProductReviews;
