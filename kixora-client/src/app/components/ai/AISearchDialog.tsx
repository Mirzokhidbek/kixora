/**
 * AISearchDialog - natural-language footwear search (Gemini on the server).
 * Pieces: AIPopularRequests, AIRecommendation, AIProductCard.
 */
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  InputBase,
  IconButton,
  CircularProgress,
  Grid,
  Button,
  Fade,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import ProductService from "../../services/ProductService";
import type { AISearchResponse, Product } from "../../../lib/types/product";
import { AIPopularRequests } from "./AIPopularRequests";
import { AIRecommendation } from "./AIRecommendation";
import { AIProductCard } from "./AIProductCard";

interface AISearchDialogProps {
  open: boolean;
  onClose: () => void;
  initialQuery?: string;
  onAddToCart?: (product: Product) => void;
}

const productService = new ProductService();

export function AISearchDialog({ open, onClose, initialQuery = "", onAddToCart }: AISearchDialogProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AISearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (searchQuery?: string) => {
    const text = (searchQuery ?? query).trim();
    if (!text) return;
    setLoading(true);
    setError(null);
    try {
      setResult(await productService.aiSearchProducts(text));
    } catch (err: any) {
      // show the real reason (e.g. AI unavailable, rate limit) instead of empty results
      setResult(null);
      setError(err?.response?.data?.message || "An error occurred during AI search. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handlePresetClick = (preset: string) => {
    setQuery(preset);
    handleSearch(preset);
  };

  const handleViewProduct = (productId: string) => {
    onClose();
    navigate(`/products/${productId}`);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: { xs: 4, md: 5 },
            bgcolor: "#ffffff",
            p: { xs: 2.5, sm: 3.5, md: 4 },
            boxShadow: "0 30px 80px rgba(0, 0, 0, 0.22)",
            position: "relative",
            overflow: "hidden",
            border: "1px solid rgba(226, 232, 240, 0.8)",
          },
        },
      }}
    >
      {/* Background Soft Glow Accents */}
      <Box
        sx={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 260,
          height: 260,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(199, 210, 254, 0.45) 0%, rgba(224, 231, 255, 0.2) 50%, rgba(255, 255, 255, 0) 75%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Floating Sparkle Star Icon (Top Right Background Accent matching Screenshot) */}
      <Box
        sx={{
          position: "absolute",
          top: 36,
          right: { xs: 65, md: 95 },
          color: "#818cf8",
          opacity: 0.85,
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
            fill="currentColor"
          />
        </svg>
      </Box>

      {/* Close Button */}
      <IconButton
        onClick={onClose}
        size="small"
        sx={{
          position: "absolute",
          top: { xs: 18, md: 24 },
          right: { xs: 18, md: 24 },
          color: "#64748b",
          bgcolor: "#f8fafc",
          border: "1px solid #e2e8f0",
          p: 0.8,
          zIndex: 2,
          "&:hover": { bgcolor: "#f1f5f9", color: "#0f172a" },
        }}
      >
        <CloseIcon sx={{ fontSize: 18 }} />
      </IconButton>

      <DialogContent sx={{ p: 0, position: "relative", zIndex: 1, overflowY: "auto", maxHeight: "80vh" }}>
        {/* Top Header Section with KIXORA Brand Logo & Title */}
        <Box sx={{ mb: 3, pr: 6 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.4, mb: 0.6 }}>
            {/* KIXORA Official Logo */}
            <Box
              component="img"
              src="/img/kixora/logo.png"
              alt="KIXORA Logo"
              onError={(e: any) => {
                e.target.style.display = "none";
              }}
              sx={{
                height: 26,
                width: "auto",
                objectFit: "contain",
              }}
            />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 900,
                fontSize: { xs: "1.25rem", md: "1.42rem" },
                color: "#0f172a",
                fontFamily: '"Outfit", sans-serif',
                letterSpacing: "-0.02em",
              }}
            >
              KIXORA AI Search Assistant
            </Typography>
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: "#64748b",
              fontSize: { xs: "0.84rem", md: "0.9rem" },
              lineHeight: 1.4,
            }}
          >
            Find your perfect shoes with AI. Just describe what you're looking for — we'll handle the rest.
          </Typography>
        </Box>

        {/* High-End Pill Search Bar (Matching Screenshot) */}
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            bgcolor: "#ffffff",
            borderRadius: 9999,
            border: "1.5px solid #818cf8",
            boxShadow: "0 0 0 4px rgba(129, 140, 248, 0.12), 0 4px 18px rgba(0, 0, 0, 0.04)",
            p: { xs: "4px 6px 4px 14px", sm: "6px 8px 6px 18px" },
            mb: 3,
            transition: "all 0.25s ease",
            "&:focus-within": {
              borderColor: "#4f46e5",
              boxShadow: "0 0 0 5px rgba(99, 102, 241, 0.2), 0 6px 24px rgba(0, 0, 0, 0.08)",
            },
          }}
        >
          {/* Dual Blue Sparkle Icons */}
          <Box sx={{ display: "flex", alignItems: "center", color: "#4f46e5", mr: 1.5, flexShrink: 0 }}>
            <AutoAwesomeIcon sx={{ fontSize: 20 }} />
          </Box>

          {/* Search Input Field */}
          <InputBase
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What shoes are you looking for? (e.g., Comfortable black sneakers for daily wear)"
            autoFocus
            sx={{
              color: "#0f172a",
              fontSize: { xs: "0.85rem", sm: "0.92rem", md: "0.96rem" },
              fontWeight: 500,
              "& input::placeholder": {
                color: "#94a3b8",
                opacity: 1,
              },
            }}
          />

          {/* Solid Black Action Button 'Search with AI ➔' */}
          <Button
            variant="contained"
            onClick={() => handleSearch()}
            disabled={!query.trim() || loading}
            sx={{
              bgcolor: "#000000",
              color: "#ffffff",
              borderRadius: 9999,
              px: { xs: 2.2, sm: 3 },
              py: { xs: 0.9, sm: 1.1 },
              fontWeight: 800,
              fontSize: { xs: "0.78rem", sm: "0.85rem" },
              textTransform: "none",
              letterSpacing: "0.02em",
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              display: "flex",
              alignItems: "center",
              gap: 1,
              "&:disabled": {
                bgcolor: "#000000",
                color: "#ffffff",
                opacity: 0.88,
              },
              transition: "all 0.2s ease",
            }}
          >
            {loading ? (
              <CircularProgress size={18} sx={{ color: "#ffffff" }} />
            ) : (
              <>
                <AutoAwesomeIcon sx={{ fontSize: 16, color: "#ffffff" }} />
                <span>Search with AI</span>
                <ArrowForwardIcon sx={{ fontSize: 15 }} />
              </>
            )}
          </Button>
        </Box>


        <AIPopularRequests onSelect={handlePresetClick} />

        {/* Loading State Animation */}
        {loading && (
          <Box
            sx={{
              py: 7,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                position: "relative",
                display: "inline-flex",
                p: 2.5,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(129,140,248,0.2) 0%, rgba(255,255,255,0) 70%)",
              }}
            >
              <CircularProgress size={44} thickness={4} sx={{ color: "#0f172a" }} />
              <AutoAwesomeIcon
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  color: "#4f46e5",
                  fontSize: 20,
                }}
              />
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 800, color: "#0f172a" }}>
              KIXORA AI is curating your selection...
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748b", maxWidth: 380 }}>
              Analyzing silhouette, materials, colorways, and comfort profile for your request.
            </Typography>
          </Box>
        )}

        {/* Error State */}
        {error && !loading && (
          <Box
            sx={{
              p: 2.5,
              borderRadius: "14px",
              bgcolor: "#fef2f2",
              border: "1px solid #fee2e2",
              color: "#991b1b",
              mb: 2,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {error}
            </Typography>
          </Box>
        )}

        {/* Results Area */}
        {result && !loading && (
          <Fade in={Boolean(result)} timeout={400}>
            <Box>
              <AIRecommendation result={result} />

              {/* Matched Products Grid Header */}
              <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 900, color: "#0f172a", fontFamily: '"Outfit", sans-serif' }}
                >
                  Matching Footwear ({result.products?.length || 0})
                </Typography>
                <Button
                  size="small"
                  endIcon={<ArrowForwardIcon sx={{ fontSize: "14px !important" }} />}
                  onClick={() => {
                    onClose();
                    navigate("/products");
                  }}
                  sx={{
                    color: "#0f172a",
                    fontWeight: 700,
                    textTransform: "none",
                    fontSize: "0.82rem",
                  }}
                >
                  View All Catalog
                </Button>
              </Box>

              {(!result.products || result.products.length === 0) ? (
                <Box sx={{ textAlign: "center", py: 4, bgcolor: "#f8fafc", borderRadius: "14px" }}>
                  <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600 }}>
                    No matching models found for this search. Try describing a different style, color, or occasion.
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {(result.products || []).map((product) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product._id}>
                      <AIProductCard product={product} onView={handleViewProduct} onAddToCart={onAddToCart} />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Fade>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default AISearchDialog;
