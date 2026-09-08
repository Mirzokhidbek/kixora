/**
 * ============================================================================
 * PopularDishes.tsx - Best Sellers "Popular Picks" (Matching Mockup)
 * ============================================================================
 * Clean 4-card grid, discount badge, heart wishlist, color dots, rating,
 * price with strikethrough, and full-width Solid Black "Add to Cart →" button.
 */

import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Button,
  Rating,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { retrievePopularDishes } from "./selector";
import { serverApi } from "../../../lib/config";

interface PopularDishesProps {
  onAdd?: (item: any) => void;
}

export function PopularDishes({ onAdd }: PopularDishesProps) {
  const navigate = useNavigate();
  const popularDishes = useSelector(retrievePopularDishes);
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getImageSrc = (img?: string) => {
    if (!img) return "";
    return img.startsWith("http") ? img : `${serverApi}/${img}`;
  };

  // Mock sample shoe metadata to ensure 4 full rich cards matching mockup
  const samplePicks = [
    {
      name: "Nike Dunk Low",
      discount: "-15%",
      price: 134.0,
      oldPrice: 158.0,
      rating: 4.8,
      reviews: "1.2k",
      colors: ["#1e3a8a", "#111827", "#ffffff"],
      image: "/img/kixora/sneakers.jpg",
    },
    {
      name: "Nike Air Force 1",
      discount: "-20%",
      price: 120.0,
      oldPrice: 150.0,
      rating: 4.7,
      reviews: "980",
      colors: ["#111827", "#ffffff", "#6b7280"],
      image: "/img/kixora/slide2.jpg",
    },
    {
      name: "New Balance 530",
      discount: "-12%",
      price: 110.0,
      oldPrice: 125.0,
      rating: 4.6,
      reviews: "856",
      colors: ["#ffffff", "#9ca3af", "#111827"],
      image: "/img/kixora/hero_light2.jpg",
    },
    {
      name: "Nike Air Max Plus",
      discount: "-18%",
      price: 146.0,
      oldPrice: 178.0,
      rating: 4.9,
      reviews: "1.5k",
      colors: ["#dc2626", "#111827", "#f97316"],
      image: "/img/kixora/hero_light1.jpg",
    },
  ];

  const displayList =
    popularDishes && popularDishes.length >= 4
      ? popularDishes.slice(0, 4)
      : samplePicks.map((sample, idx) => {
          const match = popularDishes?.[idx];
          return {
            _id: match?._id || `sample_${idx}`,
            productName: match?.productName || sample.name,
            productPrice: match?.productPrice || sample.price,
            productImages: match?.productImages || [sample.image],
            productCollection: match?.productCollection || "SNEAKERS",
            discount: sample.discount,
            oldPrice: sample.oldPrice,
            rating: sample.rating,
            reviews: sample.reviews,
            colors: sample.colors,
          };
        });

  return (
    <Box sx={{ py: { xs: 5, md: 7 }, bgcolor: "#ffffff" }}>
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            mb: 4,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: "#6b7280",
                fontWeight: 800,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontSize: "0.78rem",
                display: "block",
                mb: 0.6,
              }}
            >
              BEST SELLERS &mdash;
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: "#111827",
                fontSize: { xs: "1.8rem", md: "2.3rem" },
                letterSpacing: "-0.03em",
                fontFamily: '"Outfit", sans-serif',
              }}
            >
              Popular Picks
            </Typography>
          </Box>

          <Button
            endIcon={<ArrowForwardIcon sx={{ fontSize: "16px !important" }} />}
            onClick={() => navigate("/products")}
            sx={{
              color: "#111827",
              fontWeight: 800,
              fontSize: "0.92rem",
              textTransform: "none",
              "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
            }}
          >
            View All
          </Button>
        </Box>

        {/* 4-Column Product Grid */}
        <Grid container spacing={3}>
          {displayList.map((product: any, idx: number) => {
            const isFav = favorites.includes(product._id);
            const rawImg = product.productImages?.[0];
            const image = rawImg ? getImageSrc(rawImg) : samplePicks[idx % 4].image;
            const discount = product.discount || `-${12 + (idx * 3)}%`;
            const oldPrice = product.oldPrice || Math.round(product.productPrice * 1.2);
            const colors = product.colors || samplePicks[idx % 4].colors;

            return (
              <Grid key={product._id} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  onClick={() => navigate(product._id.startsWith("sample") ? "/products" : `/products/${product._id}`)}
                  sx={{
                    bgcolor: "#ffffff",
                    borderRadius: 3.5,
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.02)",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 14px 30px rgba(0, 0, 0, 0.07)",
                      borderColor: "#d1d5db",
                    },
                  }}
                >
                  {/* Top Bar: Discount Badge (Left) & Heart (Right) */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      right: 12,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      zIndex: 2,
                    }}
                  >
                    {/* Discount Badge */}
                    <Box
                      sx={{
                        px: 1.2,
                        py: 0.3,
                        borderRadius: 9999,
                        bgcolor: "#F3F4F6",
                        border: "1px solid #E5E7EB",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 800, color: "#111827", fontSize: "0.72rem" }}
                      >
                        {discount}
                      </Typography>
                    </Box>

                    {/* Wishlist Button */}
                    <IconButton
                      size="small"
                      onClick={(e) => toggleFavorite(e, product._id)}
                      sx={{
                        bgcolor: "#ffffff",
                        border: "1px solid #e5e7eb",
                        p: 0.7,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                        "&:hover": { bgcolor: "#f9fafb" },
                      }}
                    >
                      {isFav ? (
                        <FavoriteIcon sx={{ color: "#ef4444", fontSize: 16 }} />
                      ) : (
                        <FavoriteBorderIcon sx={{ color: "#6b7280", fontSize: 16 }} />
                      )}
                    </IconButton>
                  </Box>

                  {/* Product Image Stage */}
                  <Box
                    sx={{
                      pt: 5,
                      pb: 2,
                      px: 2.5,
                      bgcolor: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 190,
                      overflow: "hidden",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={image}
                      alt={product.productName}
                      onError={(e: any) => {
                        e.target.src = samplePicks[idx % 4].image;
                      }}
                      sx={{
                        maxHeight: 155,
                        maxWidth: "90%",
                        objectFit: "contain",
                        transition: "transform 0.3s ease",
                        "&:hover": { transform: "scale(1.08)" },
                      }}
                    />
                  </Box>

                  {/* Card Content */}
                  <CardContent sx={{ p: 2.5, pt: 1, flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <Box>
                      {/* Color Dots */}
                      <Box sx={{ display: "flex", gap: 0.7, mb: 1 }}>
                        {colors.map((c: string, cIdx: number) => (
                          <Box
                            key={cIdx}
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              bgcolor: c,
                              border: "1px solid #d1d5db",
                            }}
                          />
                        ))}
                      </Box>

                      {/* Product Name */}
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 800,
                          color: "#111827",
                          lineHeight: 1.3,
                          mb: 0.8,
                          fontSize: "0.98rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {product.productName}
                      </Typography>

                      {/* Rating */}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, mb: 1.2 }}>
                        <Rating value={product.rating || 4.8} precision={0.1} size="small" readOnly sx={{ fontSize: "0.9rem", color: "#f59e0b" }} />
                        <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 700, fontSize: "0.78rem" }}>
                          {product.rating || 4.8} ({product.reviews || "1.2k"})
                        </Typography>
                      </Box>

                      {/* Price Section */}
                      <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 900, color: "#111827", fontSize: "1.18rem" }}>
                          ${Number(product.productPrice).toFixed(2)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#9ca3af", textDecoration: "line-through", fontWeight: 600, fontSize: "0.88rem" }}>
                          ${Number(oldPrice).toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Solid Black Full-Width "Add to Cart" Button */}
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAdd && onAdd(product);
                      }}
                      startIcon={<AddShoppingCartIcon sx={{ fontSize: 16 }} />}
                      endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
                      sx={{
                        bgcolor: "#000000",
                        color: "#ffffff",
                        borderRadius: 2.5,
                        py: 1.1,
                        fontSize: "0.82rem",
                        fontWeight: 800,
                        textTransform: "none",
                        boxShadow: "none",
                        "&:hover": {
                          bgcolor: "#262626",
                          boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
