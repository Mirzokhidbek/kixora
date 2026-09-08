import { useSelector } from "react-redux";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Button,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import { useNavigate } from "react-router-dom";
import { retrievePopularDishes } from "./selector";
import { serverApi } from "../../../lib/config";

interface PopularDishesProps {
  onAdd?: (item: any) => void;
}

export function PopularDishes({ onAdd }: PopularDishesProps) {
  const navigate = useNavigate();
  const popularDishes = useSelector(retrievePopularDishes);

  const getImageSrc = (img?: string) => {
    if (!img) return "";
    return img.startsWith("http") ? img : `${serverApi}/${img}`;
  };

  if (!popularDishes || popularDishes.length === 0) {
    return (
      <Box sx={{ py: 6, bgcolor: "#ffffff", textAlign: "center" }}>
        <Container maxWidth="lg">
          <Box sx={{ p: 5, borderRadius: 4, bgcolor: "#fbfbfe", border: "1px dashed #e2e8f0", maxWidth: 500, mx: "auto" }}>
            <RestaurantMenuIcon sx={{ fontSize: 40, color: "#94a3b8", mb: 1.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a", mb: 1 }}>
              No Popular Dishes Yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Dishes added by the admin will automatically appear here based on customer views.
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 9, bgcolor: "#ffffff" }}>
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.8,
              mb: 1.5,
              bgcolor: "#fffbeb",
              px: 2,
              py: 0.6,
              borderRadius: 99,
            }}
          >
            <LocalFireDepartmentIcon sx={{ color: "#f59e0b", fontSize: 18 }} />
            <Typography
              variant="overline"
              sx={{ color: "#d97706", fontWeight: 800, letterSpacing: 1.5 }}
            >
              BURAK SIGNATURE DELICACIES
            </Typography>
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              mb: 1.5,
              color: "#0f172a",
              fontSize: { xs: "2rem", md: "2.6rem" },
            }}
          >
            Popular <span style={{ color: "#f59e0b" }}>Dishes</span>
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 580, mx: "auto", fontSize: "1.05rem" }}
          >
            Our master chef's most acclaimed wood-fired masterpieces, crafted with passion and Ottoman heritage.
          </Typography>
        </Box>

        {/* Dishes Grid */}
        <Grid container spacing={3.5}>
          {popularDishes.map((dish) => (
            <Grid key={dish._id} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                sx={{
                  borderRadius: 5,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                  border: "1px solid #f1f5f9",
                  bgcolor: "#ffffff",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
                  cursor: "pointer",
                  overflow: "hidden",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 20px 40px rgba(245, 158, 11, 0.12)",
                    borderColor: "#fde68a",
                  },
                }}
                onClick={() => navigate(`/products/${dish._id}`)}
              >
                {/* Image Container */}
                <Box sx={{ position: "relative", overflow: "hidden", pt: "68%" }}>
                  <CardMedia
                    component="img"
                    image={getImageSrc(dish.productImages?.[0])}
                    alt={dish.productName}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.5s ease",
                      "&:hover": { transform: "scale(1.08)" },
                    }}
                  />

                  {/* Views Badge */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 12,
                      right: 12,
                      bgcolor: "rgba(15, 23, 42, 0.75)",
                      backdropFilter: "blur(6px)",
                      color: "#fff",
                      px: 1.2,
                      py: 0.4,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      fontSize: "0.75rem",
                      fontWeight: 700,
                    }}
                  >
                    👁 {dish.productViews || 0}
                  </Box>

                  {/* Collection Category Tag */}
                  <Chip
                    label={dish.productCollection || "DISH"}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 14,
                      left: 14,
                      bgcolor: "#ffffff",
                      color: "#d97706",
                      fontWeight: 800,
                      fontSize: "0.68rem",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    }}
                  />
                </Box>

                {/* Content */}
                <CardContent sx={{ flexGrow: 1, p: 2.8, display: "flex", flexDirection: "column" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      fontSize: "1.05rem",
                      mb: 1,
                      lineHeight: 1.3,
                      color: "#0f172a",
                    }}
                  >
                    {dish.productName}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      flexGrow: 1,
                      fontSize: "0.85rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {dish.productDesc || "Authentic specialty prepared fresh on wood fire."}
                  </Typography>

                  {/* Bottom Action Row */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: "auto",
                      pt: 1.5,
                      borderTop: "1px solid #f8fafc",
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 900, color: "#0f172a" }}>
                      ${dish.productPrice?.toFixed(2)}
                    </Typography>

                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddShoppingCartIcon sx={{ fontSize: 16 }} />}
                      sx={{
                        borderRadius: 3,
                        px: 2.5,
                        py: 0.7,
                        fontWeight: 800,
                        fontSize: "0.82rem",
                        bgcolor: "#f59e0b",
                        color: "#090d16",
                        boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
                        "&:hover": { bgcolor: "#d97706", color: "#fff" },
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onAdd) onAdd(dish);
                      }}
                    >
                      Add
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
