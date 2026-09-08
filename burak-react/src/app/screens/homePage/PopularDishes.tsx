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

  if (!popularDishes || popularDishes.length === 0) {
    return null;
  }

  return (
    <Box sx={{ py: 9, bgcolor: "#ffffff" }}>
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 5, flexWrap: "wrap", gap: 2 }}>
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
                mb: 0.8,
              }}
            >
              CURATED SELECTION
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: "#000000",
                fontSize: { xs: "1.8rem", md: "2.4rem" },
                letterSpacing: "-0.03em",
              }}
            >
              Featured Shoes
            </Typography>
          </Box>

          <Button
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate("/products")}
            sx={{
              color: "#000000",
              fontWeight: 800,
              fontSize: "0.92rem",
              textTransform: "none",
              "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
            }}
          >
            View all models
          </Button>
        </Box>

        {/* 4-Column Product Grid */}
        <Grid container spacing={3.5}>
          {popularDishes.slice(0, 4).map((product) => {
            const isFav = favorites.includes(product._id);
            const image = product.productImages?.[0] ? getImageSrc(product.productImages[0]) : "";

            return (
              <Grid key={product._id} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  onClick={() => navigate(`/products/${product._id}`)}
                  sx={{
                    bgcolor: "#ffffff",
                    borderRadius: 4,
                    border: "1px solid #e5e7eb",
                    boxShadow: "none",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    position: "relative",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 30px rgba(0, 0, 0, 0.08)",
                      borderColor: "#d1d5db",
                    },
                  }}
                >
                  {/* Top Wishlist Button */}
                  <IconButton
                    size="small"
                    onClick={(e) => toggleFavorite(e, product._id)}
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      zIndex: 2,
                      bgcolor: "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(4px)",
                      border: "1px solid #e5e7eb",
                      p: 0.8,
                      "&:hover": { bgcolor: "#ffffff" },
                    }}
                  >
                    {isFav ? (
                      <FavoriteIcon sx={{ color: "#ef4444", fontSize: 18 }} />
                    ) : (
                      <FavoriteBorderIcon sx={{ color: "#6b7280", fontSize: 18 }} />
                    )}
                  </IconButton>

                  {/* Product Image Container */}
                  <Box
                    sx={{
                      p: 3,
                      bgcolor: "#f9fafb",
                      borderTopLeftRadius: 16,
                      borderTopRightRadius: 16,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 220,
                      overflow: "hidden",
                    }}
                  >
                    {image ? (
                      <CardMedia
                        component="img"
                        image={image}
                        alt={product.productName}
                        sx={{
                          maxHeight: 180,
                          objectFit: "contain",
                          transition: "transform 0.3s ease",
                          "&:hover": { transform: "scale(1.06) rotate(-4deg)" },
                        }}
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        KIXORA
                      </Typography>
                    )}
                  </Box>

                  {/* Card Content */}
                  <CardContent sx={{ p: 2.5, flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#6b7280",
                          fontWeight: 700,
                          fontSize: "0.72rem",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        {product.productCollection || "SNEAKERS"}
                      </Typography>

                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 800,
                          color: "#111827",
                          lineHeight: 1.3,
                          mt: 0.3,
                          mb: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {product.productName}
                      </Typography>

                      {/* Rating Mock/Display */}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 1.5 }}>
                        <Rating value={4.8} precision={0.1} size="small" readOnly sx={{ fontSize: "0.95rem" }} />
                        <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 700 }}>
                          4.8 (1.2k)
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pt: 1, borderTop: "1px solid #f3f4f6" }}>
                      <Typography variant="h6" sx={{ fontWeight: 900, color: "#000000", fontSize: "1.15rem" }}>
                        ${product.productPrice.toFixed(2)}
                      </Typography>

                      <Button
                        size="small"
                        variant="contained"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAdd && onAdd(product);
                        }}
                        startIcon={<AddShoppingCartIcon sx={{ fontSize: 16 }} />}
                        sx={{
                          bgcolor: "#000000",
                          color: "#ffffff",
                          borderRadius: 9999,
                          px: 2,
                          py: 0.7,
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          textTransform: "none",
                          boxShadow: "none",
                          "&:hover": { bgcolor: "#262626", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" },
                        }}
                      >
                        Add
                      </Button>
                    </Box>
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
