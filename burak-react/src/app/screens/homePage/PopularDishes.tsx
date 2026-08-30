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
  Rating,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { retrievePopularDishes } from "./selector";
import { serverApi } from "../../../lib/config";

interface PopularDishesProps {
  onAdd?: (item: any) => void;
}

export function PopularDishes({ onAdd }: PopularDishesProps) {
  const navigate = useNavigate();
  const popularDishes = useSelector(retrievePopularDishes);

  const defaultDishes = [
    {
      _id: "1",
      productName: "Burak Signature Tomahawk",
      productPrice: 48.0,
      productViews: 1240,
      productImages: [
        "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80",
      ],
      productDesc: "Dry-aged 45 days, seared over open oak embers with clarified Turkish butter.",
    },
    {
      _id: "2",
      productName: "Sultan Meter Kebab",
      productPrice: 36.5,
      productViews: 980,
      productImages: [
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
      ],
      productDesc: "Hand-minced lamb and beef with special Urfa isot peppers on skewers.",
    },
    {
      _id: "3",
      productName: "Gaziantep Pistachio Baklava",
      productPrice: 14.5,
      productViews: 860,
      productImages: [
        "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80",
      ],
      productDesc: "40 layers of paper-thin filo pastry filled with emerald Gaziantep pistachios.",
    },
    {
      _id: "4",
      productName: "Golden Burak Wagyu Burger",
      productPrice: 19.9,
      productViews: 740,
      productImages: [
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
      ],
      productDesc: "250g premium Wagyu beef patty, molten cheddar, smoked beef bacon on brioche.",
    },
  ];

  const dishes = popularDishes.length ? popularDishes : defaultDishes;

  const getImageSrc = (img: string) => {
    if (!img) return "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80";
    return img.startsWith("http") ? img : `${serverApi}/${img}`;
  };

  return (
    <Box sx={{ py: { xs: 6, md: 9 }, bgcolor: "#ffffff", width: "100%", overflowX: "hidden" }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Section Header */}
        <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.8, mb: 1.5, bgcolor: "#fffbeb", px: 2, py: 0.6, borderRadius: 99 }}>
            <LocalFireDepartmentIcon sx={{ color: "#f59e0b", fontSize: 18 }} />
            <Typography variant="overline" sx={{ color: "#d97706", fontWeight: 800, letterSpacing: 1.5 }}>
              TOP CHEF SPECIALS
            </Typography>
          </Box>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              mb: 1.5,
              color: "#0f172a",
              fontSize: { xs: "1.75rem", sm: "2.2rem", md: "2.6rem" },
              wordBreak: "break-word",
            }}
          >
            Popular <span style={{ color: "#f59e0b" }}>Delicious</span> Dishes
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 580, mx: "auto", fontSize: { xs: "0.92rem", md: "1.05rem" } }}>
            The most celebrated culinary masterpieces crafted by Chef CZN Burak, loved by thousands of guests daily.
          </Typography>
        </Box>

        {/* Dishes Grid */}
        <Grid container spacing={{ xs: 2.5, sm: 3, md: 3.5 }}>
          {dishes.map((dish) => (
            <Grid key={dish._id} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                sx={{
                  borderRadius: { xs: 4, md: 5 },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                  border: "1px solid #f1f5f9",
                  bgcolor: "#ffffff",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
                  cursor: "pointer",
                  overflow: "hidden",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 20px 40px rgba(245, 158, 11, 0.15)",
                    borderColor: "#fef3c7",
                  },
                }}
                onClick={() => navigate(`/products/${dish._id}`)}
              >
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
                  <Chip
                    label="POPULAR"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      bgcolor: "#f59e0b",
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: "0.7rem",
                      boxShadow: "0 4px 10px rgba(245, 158, 11, 0.4)",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 10,
                      right: 10,
                      bgcolor: "rgba(15, 23, 42, 0.75)",
                      backdropFilter: "blur(8px)",
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
                    <VisibilityIcon sx={{ fontSize: 14, color: "#f59e0b" }} />
                    <span>{dish.productViews || 0}</span>
                  </Box>
                </Box>

                <CardContent sx={{ flexGrow: 1, p: { xs: 2.2, md: 2.8 }, display: "flex", flexDirection: "column" }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, fontSize: "1.05rem", mb: 0.8, lineHeight: 1.3, color: "#0f172a" }}>
                    {dish.productName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.8, flexGrow: 1, fontSize: "0.85rem", lineHeight: 1.5 }}>
                    {dish.productDesc || "Traditional Burak culinary delight."}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Rating value={5} readOnly size="small" sx={{ color: "#f59e0b" }} />
                    <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 800 }}>
                      5.0 (120+)
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "auto", pt: 1.5, borderTop: "1px solid #f8fafc" }}>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: "#0f172a", fontSize: "1.25rem" }}>
                      ${dish.productPrice?.toFixed(2)}
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddShoppingCartIcon sx={{ fontSize: 16 }} />}
                      sx={{
                        borderRadius: 3,
                        px: 2.2,
                        py: 0.7,
                        fontWeight: 800,
                        fontSize: "0.82rem",
                        bgcolor: "#eab308",
                        color: "#fff",
                        boxShadow: "0 4px 12px rgba(234, 179, 8, 0.3)",
                        "&:hover": { bgcolor: "#ca8a04" },
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
