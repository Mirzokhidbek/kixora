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
import { useNavigate } from "react-router-dom";
import { retrieveNewDishes } from "./selector";
import { getImageUrl } from "../../../lib/config";

interface NewDishesProps {
  onAdd?: (item: any) => void;
}

export function NewDishes({ onAdd }: NewDishesProps) {
  const navigate = useNavigate();
  const newDishes = useSelector(retrieveNewDishes);
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };


  // High-res sample fallback footwear for New Arrivals
  const sampleArrivals = [
    {
      name: "Givenchy Luxury Runner",
      collection: "LIMITED_DROP",
      price: 135.0,
      rating: 4.9,
      reviews: "940",
      image: "/img/kixora/hero_light1.jpg",
    },
    {
      name: "Nike Air Jordan 1 Low",
      collection: "CASUAL",
      price: 149.0,
      rating: 4.9,
      reviews: "1.4k",
      image: "/img/kixora/slide1.jpg",
    },
    {
      name: "New Balance 530 Metallic",
      collection: "SNEAKERS",
      price: 130.0,
      rating: 4.8,
      reviews: "820",
      image: "/img/kixora/hero_light2.jpg",
    },
    {
      name: "Nike Dunk Low Retro",
      collection: "BOOTS",
      price: 134.0,
      rating: 4.8,
      reviews: "1.1k",
      image: "/img/kixora/sneakers.jpg",
    },
  ];

  const rawList = Array.isArray(newDishes) ? newDishes : [];
  const list =
    rawList.length >= 4
      ? rawList.slice(0, 4)
      : sampleArrivals.map((sample, idx) => {
          const match = rawList[idx];
          return {
            _id: match?._id || `arrival_${idx}`,
            productName: match?.productName || sample.name,
            productPrice: match?.productPrice || sample.price,
            productImages: match?.productImages || [sample.image],
            productCollection: match?.productCollection || sample.collection,
            rating: sample.rating,
            reviews: sample.reviews,
          };
        });


  return (
    <Box sx={{ py: 8, bgcolor: "#ffffff" }}>
      <Container maxWidth="lg">
        {/* Section Header Matching Mockup */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            mb: 4,
            flexWrap: "wrap",
            gap: 2,
            borderBottom: "1px solid #f3f4f6",
            pb: 2,
          }}
        >
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: "#000000",
                fontSize: { xs: "1.8rem", md: "2.2rem" },
                letterSpacing: "-0.03em",
                fontFamily: '"Outfit", -apple-system, BlinkMacSystemFont, sans-serif',
                display: "inline-block",
                position: "relative",
                pb: 1.2,
                "&::after": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  bottom: -17,
                  width: "100%",
                  height: "3px",
                  bgcolor: "#000000",
                  borderRadius: "2px",
                },
              }}
            >
              New Arrivals
            </Typography>
          </Box>

          <Button
            onClick={() => navigate("/products")}
            sx={{
              color: "#111827",
              fontWeight: 800,
              fontSize: "0.92rem",
              textTransform: "none",
              "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
            }}
          >
            View All &rarr;
          </Button>
        </Box>

        {/* 4-Column Responsive Grid */}
        <Grid container spacing={3.5}>
          {list.slice(0, 4).map((product) => {
            const isFav = favorites.includes(product._id);
            const image = getImageUrl(product.productImages?.[0]);

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
                        onError={(e: any) => {
                          e.target.src = "/img/kixora/running.jpg";
                        }}
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
                        {product.productCollection || "RUNNING"}
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

                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 1.5 }}>
                        <Rating value={4.9} precision={0.1} size="small" readOnly sx={{ fontSize: "0.95rem" }} />
                        <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 700 }}>
                          4.9 (840)
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
