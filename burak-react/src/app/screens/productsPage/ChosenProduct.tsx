import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  IconButton,
  Divider,
  Snackbar,
  Alert,
  Breadcrumbs,
  Link,
  Rating,
  Tabs,
  Tab,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

import ProductService from "../../services/ProductService";
import { setChosenProduct } from "./slice";
import { retrieveChosenProduct } from "./selector";
import { serverApi } from "../../../lib/config";
import { ProductSize } from "../../../lib/enums/common.enum";

interface ChosenProductProps {
  onAdd?: (product: any, quantity?: number) => void;
}

export function ChosenProduct({ onAdd }: ChosenProductProps) {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const product = useSelector(retrieveChosenProduct);

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string>("42");
  const [activeImgIndex, setActiveImgIndex] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string>("");

  const sizeList = [
    ProductSize.SIZE_38,
    ProductSize.SIZE_39,
    ProductSize.SIZE_40,
    ProductSize.SIZE_41,
    ProductSize.SIZE_42,
    ProductSize.SIZE_43,
    ProductSize.SIZE_44,
    ProductSize.SIZE_45,
  ];

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
      <Box sx={{ py: 12, minHeight: "70vh", display: "flex", alignItems: "center", bgcolor: "#ffffff" }}>
        <Container maxWidth="sm" sx={{ textAlign: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: "#111827" }}>
            Loading Footwear Details...
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/products")}
            sx={{ bgcolor: "#000000", color: "#ffffff", fontWeight: 700, borderRadius: 9999 }}
          >
            Back to Catalog
          </Button>
        </Container>
      </Box>
    );
  }

  const images = product.productImages && product.productImages.length > 0 ? product.productImages : [];
  const mainImageSrc = images[activeImgIndex] ? getImageSrc(images[activeImgIndex]) : "";

  const handleAddToCart = () => {
    if (onAdd) {
      for (let i = 0; i < quantity; i++) {
        onAdd({
          _id: product._id,
          productName: `${product.productName} (EU ${selectedSize})`,
          productPrice: product.productPrice,
          productImages: product.productImages,
        });
      }
    }
    setToastMsg(`Added ${quantity} x ${product.productName} (Size ${selectedSize}) to your bag!`);
    setToastOpen(true);
  };

  return (
    <Box sx={{ py: 5, bgcolor: "#ffffff", minHeight: "85vh" }}>
      <Container maxWidth="lg">
        {/* Breadcrumb Navigation */}
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <Link
              onClick={() => navigate("/")}
              sx={{ cursor: "pointer", color: "#6b7280", fontWeight: 600, fontSize: "0.85rem" }}
              underline="hover"
            >
              Home
            </Link>
            <Link
              onClick={() => navigate("/products")}
              sx={{ cursor: "pointer", color: "#6b7280", fontWeight: 600, fontSize: "0.85rem" }}
              underline="hover"
            >
              Footwear
            </Link>
            <Typography sx={{ color: "#111827", fontWeight: 700, fontSize: "0.85rem" }}>
              {product.productName}
            </Typography>
          </Breadcrumbs>

          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/products")}
            sx={{ color: "#6b7280", fontWeight: 700, textTransform: "none", fontSize: "0.85rem" }}
          >
            Back to Catalog
          </Button>
        </Box>

        {/* Main Product Layout */}
        <Grid container spacing={{ xs: 4, md: 6 }}>
          {/* Left Column: Multi-Angle Gallery */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ display: "flex", flexDirection: { xs: "column-reverse", sm: "row" }, gap: 2.5 }}>
              {/* Vertical Thumbnail List */}
              {images.length > 1 && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "row", sm: "column" },
                    gap: 1.5,
                    overflowX: { xs: "auto", sm: "visible" },
                  }}
                >
                  {images.map((img, idx) => (
                    <Box
                      key={idx}
                      onClick={() => setActiveImgIndex(idx)}
                      sx={{
                        width: { xs: 64, sm: 76 },
                        height: { xs: 64, sm: 76 },
                        borderRadius: 3,
                        p: 0.5,
                        bgcolor: "#f9fafb",
                        border: idx === activeImgIndex ? "2px solid #000000" : "1px solid #e5e7eb",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                        "&:hover": { borderColor: "#000000" },
                      }}
                    >
                      <Box
                        component="img"
                        src={getImageSrc(img)}
                        alt={`Angle ${idx + 1}`}
                        sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                      />
                    </Box>
                  ))}
                </Box>
              )}

              {/* Large Featured Image View */}
              <Box
                sx={{
                  flexGrow: 1,
                  bgcolor: "#f9fafb",
                  borderRadius: 5,
                  border: "1px solid #e5e7eb",
                  p: { xs: 3, sm: 5 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: { xs: 300, sm: 440 },
                  position: "relative",
                }}
              >
                {mainImageSrc ? (
                  <Box
                    component="img"
                    src={mainImageSrc}
                    alt={product.productName}
                    sx={{
                      maxWidth: "100%",
                      maxHeight: 380,
                      objectFit: "contain",
                      transition: "transform 0.4s ease",
                      "&:hover": { transform: "scale(1.06) rotate(-2deg)" },
                    }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No image available
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>

          {/* Right Column: Product Details & Buying Actions */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Header Title & Badge */}
              <Box>
                <Box
                  sx={{
                    display: "inline-block",
                    px: 1.5,
                    py: 0.4,
                    borderRadius: 9999,
                    bgcolor: "#f3f4f6",
                    border: "1px solid #e5e7eb",
                    mb: 1.5,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#111827",
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      fontSize: "0.72rem",
                      textTransform: "uppercase",
                    }}
                  >
                    {product.productCollection || "SNEAKERS"}
                  </Typography>
                </Box>

                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 900,
                    color: "#000000",
                    fontSize: { xs: "1.8rem", md: "2.2rem" },
                    lineHeight: 1.15,
                    letterSpacing: "-0.03em",
                    mb: 1,
                  }}
                >
                  {product.productName}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Rating value={4.8} precision={0.1} size="small" readOnly />
                  <Typography variant="body2" sx={{ color: "#6b7280", fontWeight: 700, fontSize: "0.85rem" }}>
                    4.8 (128 reviews) &bull; In Stock
                  </Typography>
                </Box>
              </Box>

              {/* Price */}
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 900, color: "#000000" }}>
                  ${product.productPrice.toFixed(2)}
                </Typography>
                <Typography variant="caption" sx={{ color: "#6b7280" }}>
                  Taxes and duties included. Free express shipping over $100.
                </Typography>
              </Box>

              <Divider />

              {/* Size Selector (EU 38-45) */}
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#111827" }}>
                    Select Size (EU)
                  </Typography>
                  <Typography
                    variant="caption"
                    onClick={() => navigate("/help")}
                    sx={{ color: "#6b7280", textDecoration: "underline", cursor: "pointer", fontWeight: 600 }}
                  >
                    Size Guide
                  </Typography>
                </Box>

                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1 }}>
                  {sizeList.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <Button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        sx={{
                          py: 1.2,
                          borderRadius: 2.5,
                          border: isSelected ? "2px solid #000000" : "1px solid #e5e7eb",
                          bgcolor: isSelected ? "#000000" : "#ffffff",
                          color: isSelected ? "#ffffff" : "#111827",
                          fontWeight: 800,
                          fontSize: "0.88rem",
                          "&:hover": {
                            bgcolor: isSelected ? "#000000" : "#f3f4f6",
                          },
                        }}
                      >
                        EU {size}
                      </Button>
                    );
                  })}
                </Box>
              </Box>

              {/* Quantity Stepper & Add to Cart */}
              <Box sx={{ display: "flex", gap: 2, alignItems: "center", pt: 1 }}>
                {/* Stepper */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #e5e7eb",
                    borderRadius: 9999,
                    p: 0.5,
                    bgcolor: "#f9fafb",
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    sx={{ color: "#374151" }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography sx={{ px: 2, fontWeight: 800, fontSize: "0.95rem" }}>
                    {quantity}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => setQuantity((q) => q + 1)}
                    sx={{ color: "#374151" }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>

                {/* Black Pill Add to Bag Button */}
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleAddToCart}
                  startIcon={<ShoppingBagOutlinedIcon />}
                  sx={{
                    py: 1.6,
                    borderRadius: 9999,
                    fontWeight: 800,
                    fontSize: "0.95rem",
                    bgcolor: "#000000",
                    color: "#ffffff",
                    textTransform: "none",
                    boxShadow: "none",
                    "&:hover": {
                      bgcolor: "#262626",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  Add to Bag &bull; ${(product.productPrice * quantity).toFixed(2)}
                </Button>

                {/* Wishlist Button */}
                <IconButton
                  onClick={() => setIsFavorite(!isFavorite)}
                  sx={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 9999,
                    p: 1.5,
                    "&:hover": { bgcolor: "#f3f4f6" },
                  }}
                >
                  {isFavorite ? (
                    <FavoriteIcon sx={{ color: "#ef4444" }} />
                  ) : (
                    <FavoriteBorderIcon sx={{ color: "#6b7280" }} />
                  )}
                </IconButton>
              </Box>

              {/* Product Perks */}
              <Box
                sx={{
                  bgcolor: "#f9fafb",
                  borderRadius: 3.5,
                  p: 2.5,
                  border: "1px solid #e5e7eb",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <LocalShippingOutlinedIcon sx={{ fontSize: 20, color: "#000000" }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#374151" }}>
                    Complimentary Express Shipping over $100
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <VerifiedOutlinedIcon sx={{ fontSize: 20, color: "#000000" }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#374151" }}>
                    100% Authentic & Original KIXORA Guarantee
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <AutorenewOutlinedIcon sx={{ fontSize: 20, color: "#000000" }} />
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#374151" }}>
                    30-Day Hassle-Free Returns & Size Exchanges
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Tabs: Description / Specifications / Care */}
        <Box sx={{ mt: 8, pt: 6, borderTop: "1px solid #e5e7eb" }}>
          <Tabs
            value={activeTab}
            onChange={(_, val) => setActiveTab(val)}
            sx={{
              mb: 3,
              "& .MuiTab-root": {
                fontWeight: 800,
                fontSize: "0.95rem",
                textTransform: "none",
                color: "#6b7280",
                "&.Mui-selected": { color: "#000000" },
              },
              "& .MuiTabs-indicator": { bgcolor: "#000000", height: 2 },
            }}
          >
            <Tab label="Description" />
            <Tab label="Specifications" />
            <Tab label="Fit & Care" />
          </Tabs>

          {activeTab === 0 && (
            <Typography variant="body1" sx={{ color: "#4b5563", lineHeight: 1.8, maxWidth: 800 }}>
              {product.productDesc ||
                "Engineered with premium technical fabrics, high-resilience foam midsole, and durable rubber outsole for supreme traction. The breathable upper hugs your foot with a glove-like fit, delivering unmatched comfort on the street or the track."}
            </Typography>
          )}

          {activeTab === 1 && (
            <Box sx={{ maxWidth: 600, display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.8, borderBottom: "1px solid #f3f4f6" }}>
                <Typography variant="body2" sx={{ color: "#6b7280" }}>Upper Material</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>Engineered Knit & Suede Overlays</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.8, borderBottom: "1px solid #f3f4f6" }}>
                <Typography variant="body2" sx={{ color: "#6b7280" }}>Midsole</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>Responsive Foam + Carbon Shank</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.8, borderBottom: "1px solid #f3f4f6" }}>
                <Typography variant="body2" sx={{ color: "#6b7280" }}>Outsole</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>Multi-Directional Traction Rubber</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.8 }}>
                <Typography variant="body2" sx={{ color: "#6b7280" }}>Weight</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>290g (Size EU 42)</Typography>
              </Box>
            </Box>
          )}

          {activeTab === 2 && (
            <Typography variant="body1" sx={{ color: "#4b5563", lineHeight: 1.8, maxWidth: 800 }}>
              Fits true to size. If you are between sizes or prefer a roomier fit, we recommend ordering one half size up. Clean with a soft brush and lukewarm water. Avoid machine washing and high heat drying.
            </Typography>
          )}
        </Box>

        <Snackbar
          open={toastOpen}
          autoHideDuration={3000}
          onClose={() => setToastOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity="success" sx={{ width: "100%", borderRadius: 3, fontWeight: 700 }}>
            {toastMsg}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
