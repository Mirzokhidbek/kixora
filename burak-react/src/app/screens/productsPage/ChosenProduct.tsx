import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  Chip,
  Button,
  Rating,
  IconButton,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import VerifiedIcon from "@mui/icons-material/Verified";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import { PRODUCTS_LIST } from "./Products";

export function ChosenProduct() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const product = PRODUCTS_LIST.find((p) => p.id === Number(productId)) || PRODUCTS_LIST[0];

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.size || "NORMAL");
  const [activeImage, setActiveImage] = useState(product.image);
  const [toastOpen, setToastOpen] = useState(false);

  const galleryImages = [
    product.image,
    "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
  ];

  const handleAddToCart = () => {
    setToastOpen(true);
  };

  return (
    <Box sx={{ py: 6, minHeight: "85vh" }}>
      <Container maxWidth="lg">
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/products")}
          sx={{ mb: 4, color: "#64748b", fontWeight: 700, "&:hover": { color: "#0f172a" } }}
        >
          Back to Restaurant Menu
        </Button>

        <Grid container spacing={6}>
          {/* Left Column: Gallery */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                border: "1px solid #e2e8f0",
                boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
                mb: 2,
              }}
            >
              <CardMedia
                component="img"
                height="420"
                image={activeImage}
                alt={product.name}
                sx={{ objectFit: "cover" }}
              />
            </Card>

            {/* Thumbnail switcher */}
            <Box sx={{ display: "flex", gap: 2 }}>
              {galleryImages.map((img, idx) => (
                <Box
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  sx={{
                    width: 90,
                    height: 75,
                    borderRadius: 3,
                    overflow: "hidden",
                    cursor: "pointer",
                    border: activeImage === img ? "2.5px solid #f59e0b" : "1px solid #e2e8f0",
                    transition: "0.2s",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                >
                  <Box component="img" src={img} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Right Column: Details & Ordering */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
              <Chip
                label={product.collection}
                color="primary"
                sx={{ fontWeight: 800, fontSize: "0.75rem", borderRadius: 1.5 }}
              />
              {product.isPopular && (
                <Chip
                  icon={<LocalFireDepartmentIcon sx={{ color: "#fff !important", fontSize: 16 }} />}
                  label="CHEF CHOICE"
                  sx={{ bgcolor: "#ef4444", color: "#fff", fontWeight: 800, fontSize: "0.75rem" }}
                />
              )}
            </Box>

            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1.5 }}>
              {product.name}
            </Typography>

            {/* Rating & Reviews */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
              <Rating value={product.rating} precision={0.1} readOnly size="medium" />
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0f172a" }}>
                {product.rating}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ({product.reviews} Verified Foodie Reviews)
              </Typography>
            </Box>

            {/* Price */}
            <Typography variant="h3" sx={{ fontWeight: 800, color: "#0f172a", mb: 3 }}>
              ${product.price.toFixed(2)}
            </Typography>

            <Typography variant="body1" sx={{ color: "#475569", lineHeight: 1.8, mb: 3 }}>
              {product.desc}
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Portion / Size Selector */}
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: "#0f172a" }}>
              SELECT PORTION / VOLUME:
            </Typography>
            <Box sx={{ display: "flex", gap: 1.5, mb: 3 }}>
              {["NORMAL", "LARGE", "SET"].map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "contained" : "outlined"}
                  color="primary"
                  onClick={() => setSelectedSize(size)}
                  sx={{
                    borderRadius: 2.5,
                    px: 3,
                    fontWeight: 700,
                    borderColor: selectedSize === size ? "primary.main" : "#cbd5e1",
                    color: selectedSize === size ? "#000" : "#475569",
                  }}
                >
                  {size}
                </Button>
              ))}
            </Box>

            {/* Quantity Selector & Add Button */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "#f1f5f9",
                  borderRadius: 3,
                  p: 0.5,
                  border: "1px solid #cbd5e1",
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  sx={{ color: "#0f172a" }}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography sx={{ px: 2, fontWeight: 800, fontSize: "1.1rem" }}>{quantity}</Typography>
                <IconButton size="small" onClick={() => setQuantity(quantity + 1)} sx={{ color: "#0f172a" }}>
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>

              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                onClick={handleAddToCart}
                startIcon={<AddShoppingCartIcon />}
                sx={{
                  borderRadius: 3,
                  py: 1.6,
                  fontWeight: 800,
                  fontSize: "1.05rem",
                  boxShadow: "0 8px 24px rgba(245, 158, 11, 0.35)",
                }}
              >
                Add To Basket &bull; ${(product.price * quantity).toFixed(2)}
              </Button>
            </Box>

            {/* Guarantees Box */}
            <Box sx={{ p: 2.5, bgcolor: "#f8fafc", borderRadius: 3, border: "1px solid #e2e8f0" }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <VerifiedIcon sx={{ color: "#10b981", fontSize: 20 }} />
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                      100% Halal Certified Meat
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <DeliveryDiningIcon sx={{ color: "primary.main", fontSize: 20 }} />
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                      Insulated Thermal Box Delivery
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <RestaurantIcon sx={{ color: "#6366f1", fontSize: 20 }} />
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                      Handcrafted Fresh Upon Order Confirmation
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Toast Notification */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setToastOpen(false)} severity="success" sx={{ width: "100%", borderRadius: 2 }}>
          Added {quantity}x "{product.name}" to your basket!
        </Alert>
      </Snackbar>
    </Box>
  );
}
