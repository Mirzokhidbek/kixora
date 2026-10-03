import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Rating,
  Chip,
  IconButton,
  Divider,
  Snackbar,
  Alert,
  Breadcrumbs,
  Link,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import VisibilityIcon from "@mui/icons-material/Visibility";

import ProductService from "../../services/ProductService";
import { setChosenProduct } from "./slice";
import { retrieveChosenProduct } from "./selector";
import { serverApi } from "../../../lib/config";

export function ChosenProduct() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const product = useSelector(retrieveChosenProduct);

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedPortion, setSelectedPortion] = useState<string>("NORMAL");
  const [activeImgIndex, setActiveImgIndex] = useState<number>(0);
  const [toastOpen, setToastOpen] = useState<boolean>(false);

  useEffect(() => {
    if (productId) {
      const productService = new ProductService();
      productService
        .getProduct(productId)
        .then((data) => dispatch(setChosenProduct(data)))
        .catch((err) => {
          console.log("Error loading chosen product:", err);
          // Fallback demo product
          dispatch(
            setChosenProduct({
              _id: productId,
              productName: "Burak Giant Tomahawk Steak",
              productPrice: 48.0,
              productLeftCount: 20,
              productCollection: "DISH" as any,
              productStatus: "PROCESS" as any,
              productViews: 1245,
              productImages: [
                "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
              ],
              productDesc:
                "45-day dry-aged USDA Prime beef ribeye steak, seasoned with Mediterranean sea salt crystals and seared on open oak embers. Served with clarified Turkish butter and grilled shallots.",
              createdAt: "",
              updatedAt: "",
            })
          );
        });
    }
  }, [productId, dispatch]);

  const getImageSrc = (img?: string) => {
    if (!img) return "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80";
    return img.startsWith("http") ? img : `${serverApi}/${img}`;
  };

  const images = product?.productImages?.length
    ? product.productImages
    : ["https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80"];

  const unitPrice = product ? product.productPrice : 48.0;
  const totalPrice = unitPrice * quantity;

  return (
    <Box sx={{ py: 6, minHeight: "85vh", bgcolor: "#f8fafc" }}>
      <Container maxWidth="lg">
        {/* Breadcrumb Navigation */}
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              underline="hover"
              color="inherit"
              sx={{ cursor: "pointer", fontWeight: 600 }}
              onClick={() => navigate("/")}
            >
              Home
            </Link>
            <Link
              underline="hover"
              color="inherit"
              sx={{ cursor: "pointer", fontWeight: 600 }}
              onClick={() => navigate("/products")}
            >
              Menu
            </Link>
            <Typography color="text.primary" sx={{ fontWeight: 700 }}>
              {product?.productName || "Product Detail"}
            </Typography>
          </Breadcrumbs>

          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/products")}
            sx={{ borderRadius: 3, fontWeight: 700 }}
          >
            Back to Menu
          </Button>
        </Box>

        {/* Main Product Presentation */}
        <Grid container spacing={6}>
          {/* Left Column: Image Gallery */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Large Active Image */}
              <Box
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: "0 16px 40px rgba(15, 23, 42, 0.1)",
                  border: "1px solid #e2e8f0",
                  height: { xs: 320, md: 450 },
                  bgcolor: "#fff",
                }}
              >
                <Box
                  component="img"
                  src={getImageSrc(images[activeImgIndex])}
                  alt={product?.productName}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.4s ease",
                    "&:hover": { transform: "scale(1.03)" },
                  }}
                />
              </Box>

              {/* Thumbnails Row */}
              {images.length > 1 && (
                <Box sx={{ display: "flex", gap: 2 }}>
                  {images.map((img, idx) => (
                    <Box
                      key={idx}
                      onClick={() => setActiveImgIndex(idx)}
                      sx={{
                        width: 90,
                        height: 90,
                        borderRadius: 3,
                        overflow: "hidden",
                        cursor: "pointer",
                        border: idx === activeImgIndex ? "2.5px solid #f59e0b" : "1px solid #e2e8f0",
                        boxShadow: idx === activeImgIndex ? "0 4px 12px rgba(245, 158, 11, 0.3)" : "none",
                        opacity: idx === activeImgIndex ? 1 : 0.65,
                        transition: "all 0.2s ease",
                      }}
                    >
                      <Box component="img" src={getImageSrc(img)} alt="thumbnail" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Grid>

          {/* Right Column: Culinary Details & Basket Customization */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                <Chip
                  label={product?.productCollection || "CHEF SIGNATURE"}
                  sx={{ bgcolor: "#0f172a", color: "#f59e0b", fontWeight: 800, fontSize: "0.75rem" }}
                  size="small"
                />
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#64748b", fontSize: "0.85rem" }}>
                  <VisibilityIcon sx={{ fontSize: 16, color: "#f59e0b" }} />
                  <span>{product?.productViews || 0} views</span>
                </Box>
              </Box>

              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1.5, fontSize: { xs: "1.8rem", md: "2.5rem" } }}>
                {product?.productName || "Signature Dish"}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                <Rating value={5} readOnly precision={0.5} sx={{ color: "#f59e0b" }} />
                <Typography variant="body2" sx={{ color: "#475569", fontWeight: 700 }}>
                  5.0 &bull; 180+ Verified Foodie Reviews
                </Typography>
              </Box>

              <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a", mb: 3 }}>
                ${unitPrice.toFixed(2)}
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 4 }}>
                {product?.productDesc ||
                  "A masterclass in Ottoman gastronomy, prepared with heritage butchery and cooked over open wood flames."}
              </Typography>

              <Divider sx={{ mb: 4 }} />

              {/* Portion Selector */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5 }}>
                  Select Portion Size
                </Typography>
                <Box sx={{ display: "flex", gap: 1.5 }}>
                  {["NORMAL", "LARGE", "SET"].map((size) => (
                    <Button
                      key={size}
                      variant={selectedPortion === size ? "contained" : "outlined"}
                      color={selectedPortion === size ? "primary" : "inherit"}
                      onClick={() => setSelectedPortion(size)}
                      sx={{
                        borderRadius: 3,
                        px: 3,
                        fontWeight: 700,
                        borderColor: selectedPortion === size ? "primary.main" : "#cbd5e1",
                      }}
                    >
                      {size}
                    </Button>
                  ))}
                </Box>
              </Box>

              {/* Quantity Counter & Add to Basket Button */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 5 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    border: "1.5px solid #cbd5e1",
                    borderRadius: 3,
                    bgcolor: "#fff",
                    p: 0.5,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography sx={{ px: 2.5, fontWeight: 800, fontSize: "1.1rem" }}>
                    {quantity}
                  </Typography>
                  <IconButton size="small" onClick={() => setQuantity(quantity + 1)}>
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<AddShoppingCartIcon />}
                  onClick={() => setToastOpen(true)}
                  sx={{
                    flexGrow: 1,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 800,
                    fontSize: "1.05rem",
                    boxShadow: "0 10px 25px rgba(245, 158, 11, 0.3)",
                  }}
                >
                  Add to Cart &bull; ${totalPrice.toFixed(2)}
                </Button>
              </Box>

              {/* Culinary Guarantees */}
              <Box sx={{ mt: "auto", display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, color: "#334155" }}>
                  <VerifiedIcon sx={{ color: "#10b981", fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    100% Halal Certified Prime Cuts
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, color: "#334155" }}>
                  <LocalShippingIcon sx={{ color: "primary.main", fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Delivered in Temperature-Controlled Thermal Vaults
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, color: "#334155" }}>
                  <RestaurantIcon sx={{ color: "#6366f1", fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Signature Recipe by Chef CZN Burak
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Confirmation Toast */}
        <Snackbar
          open={toastOpen}
          autoHideDuration={3000}
          onClose={() => setToastOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity="success" sx={{ width: "100%", borderRadius: 3, fontWeight: 700 }}>
            Added {quantity}x "{product?.productName}" to your order cart!
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
