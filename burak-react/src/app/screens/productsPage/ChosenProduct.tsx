import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Chip,
  IconButton,
  Divider,
  Snackbar,
  Alert,
  Breadcrumbs,
  Link,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import StorefrontIcon from "@mui/icons-material/Storefront";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";

import ProductService from "../../services/ProductService";
import { setChosenProduct } from "./slice";
import { retrieveChosenProduct, retrieveRestaurant, retrieveProducts } from "./selector";
import { serverApi } from "../../../lib/config";
import type { Product } from "../../../lib/types/product";

interface ChosenProductProps {
  onAdd?: (product: any, quantity?: number) => void;
}

export function ChosenProduct({ onAdd }: ChosenProductProps) {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const product = useSelector(retrieveChosenProduct);
  const restaurant = useSelector(retrieveRestaurant);
  const allProducts = useSelector(retrieveProducts);

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedPortion, setSelectedPortion] = useState<string>("NORMAL");
  const [activeImgIndex, setActiveImgIndex] = useState<number>(0);
  const [toastOpen, setToastOpen] = useState<boolean>(false);

  useEffect(() => {
    if (productId) {
      const productService = new ProductService();
      productService
        .getProduct(productId)
        .then((data) => {
          dispatch(setChosenProduct(data));
          setActiveImgIndex(0);
        })
        .catch((err) => {
          console.log("Error loading chosen product:", err);
        });
    }
  }, [productId, dispatch]);

  const getImageSrc = (img?: string) => {
    if (!img) return "";
    return img.startsWith("http") ? img : `${serverApi}/${img}`;
  };

  if (!product) {
    return (
      <Box sx={{ py: 10, minHeight: "75vh", display: "flex", alignItems: "center", bgcolor: "#ffffff" }}>
        <Container maxWidth="sm" sx={{ textAlign: "center" }}>
          <RestaurantMenuIcon sx={{ fontSize: 48, color: "#94a3b8", mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: "#0f172a" }}>
            Dish Details Loading or Not Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Please select a dish from the menu catalog.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/products")}
            sx={{ bgcolor: "#f59e0b", color: "#000", fontWeight: 800, borderRadius: 2.5 }}
          >
            Back to Menu Catalog
          </Button>
        </Container>
      </Box>
    );
  }

  const images = product.productImages && product.productImages.length > 0 ? product.productImages : [];

  const basePrice = product.productPrice || 0;
  const portionMultiplier = selectedPortion === "LARGE" ? 1.3 : selectedPortion === "SET" ? 1.5 : 1.0;
  const unitPrice = basePrice * portionMultiplier;
  const totalPrice = unitPrice * quantity;

  // Filter other related dishes from live database
  const relatedDishes = allProducts.filter((p: Product) => p._id !== productId).slice(0, 3);

  const handleAddToCart = () => {
    if (onAdd && product) {
      onAdd(
        {
          ...product,
          productPrice: unitPrice,
        },
        quantity
      );
      setToastOpen(true);
    }
  };

  return (
    <Box sx={{ py: 5, minHeight: "85vh", bgcolor: "#ffffff" }}>
      <Container maxWidth="lg">
        {/* Navigation Breadcrumbs */}
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              underline="hover"
              color="inherit"
              onClick={() => navigate("/")}
              sx={{ cursor: "pointer", fontWeight: 600, fontSize: "0.9rem" }}
            >
              Home
            </Link>
            <Link
              underline="hover"
              color="inherit"
              onClick={() => navigate("/products")}
              sx={{ cursor: "pointer", fontWeight: 600, fontSize: "0.9rem" }}
            >
              Menu
            </Link>
            <Typography color="text.primary" sx={{ fontWeight: 800, fontSize: "0.9rem" }}>
              {product.productName}
            </Typography>
          </Breadcrumbs>

          <Button
            variant="outlined"
            size="small"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/products")}
            sx={{ borderRadius: 2.5, fontWeight: 700, borderColor: "#e2e8f0", color: "#64748b" }}
          >
            Back to Menu
          </Button>
        </Box>

        {/* Main Product Showcase Grid */}
        <Grid container spacing={6}>
          {/* Left Column: Media Gallery */}
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Main Stage Image */}
            <Box
              sx={{
                width: "100%",
                borderRadius: 5,
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08)",
                border: "1px solid #f1f5f9",
                bgcolor: "#f8fafc",
                position: "relative",
                aspectRatio: "4/3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {images[activeImgIndex] ? (
                <img
                  src={getImageSrc(images[activeImgIndex])}
                  alt={product.productName}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <RestaurantIcon sx={{ fontSize: 60, color: "#cbd5e1" }} />
              )}

              {/* Status Chip */}
              <Chip
                label={product.productCollection || "DISH"}
                size="small"
                sx={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  bgcolor: "#ffffff",
                  color: "#d97706",
                  fontWeight: 800,
                  fontSize: "0.75rem",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
            </Box>

            {/* Thumbnail Navigation Row */}
            {images.length > 1 && (
              <Box sx={{ display: "flex", gap: 2, mt: 2.5, overflowX: "auto", pb: 1 }}>
                {images.map((img: string, idx: number) => (
                  <Box
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 3,
                      overflow: "hidden",
                      cursor: "pointer",
                      border: activeImgIndex === idx ? "2.5px solid #f59e0b" : "1.5px solid #e2e8f0",
                      boxShadow: activeImgIndex === idx ? "0 4px 14px rgba(245, 158, 11, 0.3)" : "none",
                      transition: "0.2s ease",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={getImageSrc(img)}
                      alt={`Thumbnail ${idx + 1}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Grid>

          {/* Right Column: Dish Specs & Portion Builder */}
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Restaurant Affiliation */}
            {restaurant && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <StorefrontIcon sx={{ fontSize: 18, color: "#f59e0b" }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: "#d97706", letterSpacing: 1 }}>
                  AUTHENTIC KITCHEN &bull; {restaurant.memberNick?.toUpperCase()}
                </Typography>
              </Box>
            )}

            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: "#0f172a",
                mb: 1.5,
                lineHeight: 1.2,
                fontSize: { xs: "2rem", md: "2.4rem" },
              }}
            >
              {product.productName}
            </Typography>

            {/* Views & Availability */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5, flexWrap: "wrap" }}>
              <Chip
                icon={<VerifiedIcon sx={{ fontSize: 16, color: "#10b981 !important" }} />}
                label={product.productLeftCount > 0 ? "IN STOCK" : "PRE-ORDER"}
                size="small"
                sx={{
                  bgcolor: "rgba(16, 185, 129, 0.1)",
                  color: "#059669",
                  fontWeight: 800,
                  fontSize: "0.75rem",
                }}
              />
              <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600 }}>
                👁 {product.productViews || 0} gourmet food lovers viewed
              </Typography>
            </Box>

            {/* Dynamic Price Display */}
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 2, mb: 3 }}>
              <Typography variant="h3" sx={{ fontWeight: 900, color: "#0f172a" }}>
                ${unitPrice.toFixed(2)}
              </Typography>
              {selectedPortion !== "NORMAL" && (
                <Typography variant="body2" sx={{ color: "#f59e0b", fontWeight: 700 }}>
                  ({selectedPortion} Portion)
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 2.5, borderColor: "#f1f5f9" }} />

            {/* Culinary Description */}
            <Typography variant="body1" sx={{ color: "#475569", lineHeight: 1.8, mb: 3.5 }}>
              {product.productDesc || "Handcrafted Ottoman recipe made with fresh ingredients and grilled over open embers."}
            </Typography>

            {/* Portion Size Selection */}
            <Box sx={{ mb: 3.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#0f172a", mb: 1.2 }}>
                SELECT PORTION SIZE:
              </Typography>
              <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                {[
                  { key: "NORMAL", label: "Normal (Standard)", price: `$${basePrice.toFixed(2)}` },
                  { key: "LARGE", label: "Large (+30%)", price: `$${(basePrice * 1.3).toFixed(2)}` },
                  { key: "SET", label: "VIP Banquet Set (+50%)", price: `$${(basePrice * 1.5).toFixed(2)}` },
                ].map((item) => (
                  <Button
                    key={item.key}
                    variant={selectedPortion === item.key ? "contained" : "outlined"}
                    onClick={() => setSelectedPortion(item.key)}
                    sx={{
                      borderRadius: 3,
                      px: 2.5,
                      py: 1,
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      bgcolor: selectedPortion === item.key ? "#0f172a" : "transparent",
                      color: selectedPortion === item.key ? "#fff" : "#475569",
                      borderColor: "#e2e8f0",
                      "&:hover": {
                        bgcolor: selectedPortion === item.key ? "#1e293b" : "#f8fafc",
                        borderColor: "#cbd5e1",
                      },
                    }}
                  >
                    {item.label} &bull; {item.price}
                  </Button>
                ))}
              </Box>
            </Box>

            {/* Quantity Selector & Add to Cart Action */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4, flexWrap: "wrap" }}>
              {/* Stepper */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  border: "2px solid #e2e8f0",
                  borderRadius: 3,
                  p: 0.5,
                  bgcolor: "#f8fafc",
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  sx={{ color: "#0f172a" }}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography sx={{ px: 2, fontWeight: 800, fontSize: "1.1rem", minWidth: 40, textAlign: "center" }}>
                  {quantity}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setQuantity(quantity + 1)}
                  sx={{ color: "#0f172a" }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* Add to Cart Button */}
              <Button
                variant="contained"
                size="large"
                startIcon={<AddShoppingCartIcon />}
                onClick={handleAddToCart}
                sx={{
                  flexGrow: 1,
                  py: 1.6,
                  borderRadius: 3,
                  fontWeight: 900,
                  fontSize: "1rem",
                  bgcolor: "#f59e0b",
                  color: "#090d16",
                  boxShadow: "0 8px 25px rgba(245, 158, 11, 0.4)",
                  "&:hover": { bgcolor: "#fbbf24" },
                }}
              >
                Add {quantity} to Cart &bull; ${totalPrice.toFixed(2)}
              </Button>
            </Box>

            {/* Quality Guarantees */}
            <Box sx={{ p: 2.5, bgcolor: "#fffbeb", borderRadius: 3, border: "1px solid #fef3c7", display: "flex", gap: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocalShippingIcon sx={{ color: "#d97706", fontSize: 20 }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#92400e" }}>
                  Express Hot Delivery (30-40 min)
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <RestaurantIcon sx={{ color: "#d97706", fontSize: 20 }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#92400e" }}>
                  Fresh Wood-Fired Preparation
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Related Dishes from Database */}
        {relatedDishes.length > 0 && (
          <Box sx={{ mt: 10 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 3.5, color: "#0f172a" }}>
              Pair With Other Culinary Specialties
            </Typography>
            <Grid container spacing={3.5}>
              {relatedDishes.map((dish: Product) => (
                <Grid key={dish._id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    sx={{
                      borderRadius: 4,
                      border: "1px solid #f1f5f9",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.03)",
                      cursor: "pointer",
                      transition: "0.2s ease",
                      "&:hover": { transform: "translateY(-4px)", borderColor: "#fde68a" },
                    }}
                    onClick={() => {
                      navigate(`/products/${dish._id}`);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <Box sx={{ pt: "60%", position: "relative", bgcolor: "#f8fafc" }}>
                      {dish.productImages?.[0] ? (
                        <CardMedia
                          component="img"
                          image={getImageSrc(dish.productImages[0])}
                          alt={dish.productName}
                          sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <Box sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <RestaurantIcon sx={{ fontSize: 40, color: "#cbd5e1" }} />
                        </Box>
                      )}
                    </Box>
                    <CardContent sx={{ p: 2.5 }}>
                      <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5, fontSize: "1.05rem" }}>
                        {dish.productName}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 900, color: "#f59e0b" }}>
                        ${dish.productPrice?.toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Added Toast */}
        <Snackbar
          open={toastOpen}
          autoHideDuration={2500}
          onClose={() => setToastOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity="success" sx={{ width: "100%", borderRadius: 3, fontWeight: 700 }}>
            {quantity} &times; {product.productName} added to your basket! 🛒
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
