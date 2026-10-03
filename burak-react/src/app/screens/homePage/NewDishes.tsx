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
      productName: "Hatay Kunefe with Buffalo Clotted Cream",
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
    <Box sx={{ py: 8, bgcolor: "#f8fafc" }}>
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <SparklesIcon sx={{ color: "#f59e0b" }} />
            <Typography variant="overline" sx={{ color: "primary.main", fontWeight: 800, letterSpacing: 2 }}>
              FRESH FROM THE KITCHEN
            </Typography>
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1.5 }}>
            New Seasonal Creations
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
            Explore the latest seasonal arrivals and authentic Anatolian delicacies newly introduced by our culinary team.
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
                    transform: "translateY(-6px)",
                    boxShadow: "0 16px 30px rgba(15, 23, 42, 0.08)",
                  },
                }}
                onClick={() => navigate(`/products/${dish._id}`)}
              >
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="190"
                    image={getImageSrc(dish.productImages?.[0])}
                    alt={dish.productName}
                  />
                  <Chip
                    label="NEW"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      bgcolor: "#10b981",
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: "0.7rem",
                    }}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 2.5, display: "flex", flexDirection: "column" }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, fontSize: "1rem", mb: 1 }}>
                    {dish.productName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1, fontSize: "0.83rem", lineHeight: 1.5 }}>
                    {dish.productDesc || "Fresh seasonal Turkish dish."}
                  </Typography>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "auto", pt: 1, borderTop: "1px solid #f1f5f9" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0f172a" }}>
                      ${dish.productPrice?.toFixed(2)}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      startIcon={<AddShoppingCartIcon sx={{ fontSize: 16 }} />}
                      sx={{ borderRadius: 2, fontWeight: 700, fontSize: "0.75rem" }}
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
