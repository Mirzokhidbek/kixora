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
import SparklesIcon from "@mui/icons-material/AutoAwesome";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useNavigate } from "react-router-dom";
import { retrieveNewDishes } from "./selector";
import { serverApi } from "../../../lib/config";

interface NewDishesProps {
  onAdd?: (item: any) => void;
}

export function NewDishes({ onAdd }: NewDishesProps) {
  const navigate = useNavigate();
  const newDishes = useSelector(retrieveNewDishes);

  const defaultNewDishes = [
    {
      _id: "new-1",
      productName: "Hatay Kunefe with Buffalo Cream",
      productPrice: 16.5,
      productImages: [
        "https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=800&q=80",
      ],
      productDesc: "Crisp shredded phyllo dough layered with molten Hatay cheese, soaked in warm syrup.",
    },
    {
      _id: "new-2",
      productName: "Traditional Ottoman Foamy Ayran",
      productPrice: 5.0,
      productImages: [
        "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80",
      ],
      productDesc: "Served chilled in handcrafted authentic copper mugs with rich mountain mint.",
    },
    {
      _id: "new-3",
      productName: "Aegean Cold Mezze Platter",
      productPrice: 22.0,
      productImages: [
        "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80",
      ],
      productDesc: "Hummus with pastirma, smoky mutabal, spicy ezme, and freshly baked lavash.",
    },
    {
      _id: "new-4",
      productName: "Black Sea Saffron Brewed Tea",
      productPrice: 4.0,
      productImages: [
        "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
      ],
      productDesc: "Double-tiered samovar brewed Turkish tea with natural saffron and sugar crystals.",
    },
  ];

  const dishes = newDishes.length ? newDishes : defaultNewDishes;

  const getImageSrc = (img: string) => {
    if (!img) return "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80";
    return img.startsWith("http") ? img : `${serverApi}/${img}`;
  };

  return (
    <Box sx={{ py: 9, bgcolor: "#fbfbfe" }}>
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.8, mb: 1.5, bgcolor: "#ecfdf5", px: 2, py: 0.6, borderRadius: 99 }}>
            <SparklesIcon sx={{ color: "#10b981", fontSize: 18 }} />
            <Typography variant="overline" sx={{ color: "#059669", fontWeight: 800, letterSpacing: 1.5 }}>
              FRESH CHEF CREATIONS
            </Typography>
          </Box>
          <Typography variant="h2" sx={{ fontWeight: 900, mb: 1.5, color: "#0f172a", fontSize: { xs: "2rem", md: "2.6rem" } }}>
            New <span style={{ color: "#f59e0b" }}>Experience</span> In Turkish Food
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 580, mx: "auto", fontSize: "1.05rem" }}>
            Explore our latest Anatolian delicacies newly introduced to make an unforgettable impression on your palate.
          </Typography>
        </Box>

        {/* Dishes Grid */}
        <Grid container spacing={3.5}>
          {dishes.map((dish) => (
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
                    boxShadow: "0 20px 40px rgba(16, 185, 129, 0.12)",
                    borderColor: "#a7f3d0",
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
                    label="NEW"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 14,
                      left: 14,
                      bgcolor: "#10b981",
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: "0.7rem",
                      boxShadow: "0 4px 10px rgba(16, 185, 129, 0.4)",
                    }}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 2.8, display: "flex", flexDirection: "column" }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, fontSize: "1.05rem", mb: 1, lineHeight: 1.3, color: "#0f172a" }}>
                    {dish.productName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1, fontSize: "0.85rem", lineHeight: 1.6 }}>
                    {dish.productDesc || "Fresh seasonal Turkish dish."}
                  </Typography>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "auto", pt: 1.5, borderTop: "1px solid #f8fafc" }}>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: "#0f172a" }}>
                      ${dish.productPrice?.toFixed(2)}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AddShoppingCartIcon sx={{ fontSize: 16 }} />}
                      sx={{
                        borderRadius: 3,
                        px: 2.5,
                        py: 0.7,
                        fontWeight: 800,
                        fontSize: "0.82rem",
                        borderColor: "#e2e8f0",
                        color: "#0f172a",
                        "&:hover": {
                          borderColor: "#f59e0b",
                          bgcolor: "#fffbeb",
                        },
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
