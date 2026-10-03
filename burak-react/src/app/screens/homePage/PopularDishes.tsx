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
      productName: "Burak Giant Tomahawk Steak",
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
    <Box sx={{ py: 8, bgcolor: "#fff" }}>
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <LocalFireDepartmentIcon sx={{ color: "#ef4444" }} />
            <Typography variant="overline" sx={{ color: "primary.main", fontWeight: 800, letterSpacing: 2 }}>
              MOST POPULAR SELECTIONS
            </Typography>
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1.5 }}>
            Chef's Signature Dishes
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
            The most celebrated culinary masterpieces crafted by Chef CZN Burak, ordered by thousands of food lovers daily.
          </Typography>
        </Box>

        {/* Dishes Grid */}
        <Grid container spacing={3.5}>
          {dishes.map((dish) => (
            <Grid key={dish._id} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                sx={{
                  borderRadius: 4,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  border: "1px solid #e2e8f0",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 20px 35px rgba(15, 23, 42, 0.12)",
                    borderColor: "primary.light",
                  },
                }}
                onClick={() => navigate(`/products/${dish._id}`)}
              >
                <Box sx={{ position: "relative", overflow: "hidden" }}>
                  <CardMedia
                    component="img"
                    height="210"
                    image={getImageSrc(dish.productImages?.[0])}
                    alt={dish.productName}
                    sx={{
                      transition: "transform 0.5s ease",
                      "&:hover": { transform: "scale(1.06)" },
                    }}
                  />
                  <Chip
                    label="SIGNATURE"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      bgcolor: "#0f172a",
                      color: "#f59e0b",
                      fontWeight: 800,
                      fontSize: "0.72rem",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 10,
                      right: 10,
                      bgcolor: "rgba(0,0,0,0.65)",
                      color: "#fff",
                      px: 1,
                      py: 0.3,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      fontSize: "0.75rem",
                    }}
                  >
                    <VisibilityIcon sx={{ fontSize: 14, color: "#f59e0b" }} />
                    <span>{dish.productViews || 0}</span>
                  </Box>
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 2.5, display: "flex", flexDirection: "column" }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, fontSize: "1.05rem", mb: 1, lineHeight: 1.3 }}>
                    {dish.productName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1, fontSize: "0.85rem", lineHeight: 1.5 }}>
                    {dish.productDesc || "Traditional Burak culinary delight."}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Rating value={5} readOnly size="small" sx={{ color: "#f59e0b" }} />
                    <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700 }}>
                      5.0
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "auto", pt: 1, borderTop: "1px solid #f1f5f9" }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
                      ${dish.productPrice?.toFixed(2)}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<AddShoppingCartIcon sx={{ fontSize: 16 }} />}
                      sx={{ borderRadius: 2.5, px: 2, fontWeight: 700, fontSize: "0.8rem" }}
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
