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
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useNavigate } from "react-router-dom";

export function PopularDishes() {
  const navigate = useNavigate();

  const populars = [
    {
      id: 1,
      name: "Giant Tomahawk Gold Ribeye",
      price: 48.0,
      image: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80",
      desc: "Prime 1.2kg bone-in steak, flamed tableside with clarified thyme butter.",
      rating: 4.9,
    },
    {
      id: 2,
      name: "Sultan Meter Charcoal Kebab",
      price: 36.5,
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
      desc: "1-meter minced lamb and prime beef kebab with grilled sumac onions and flatbread.",
      rating: 4.8,
    },
    {
      id: 4,
      name: "Gaziantep Emerald Baklava",
      price: 14.5,
      image: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80",
      desc: "40 crispy phyllo layers soaked in honey syrup with crushed green pistachios.",
      rating: 5.0,
    },
    {
      id: 3,
      name: "Double Wagyu Sizzler Burger",
      price: 19.9,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
      desc: "Double wagyu smash patties in cheddar lava with brioche bun.",
      rating: 4.7,
    },
  ];

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 5 }}>
          <div>
            <Chip
              icon={<LocalFireDepartmentIcon sx={{ color: "#ef4444 !important" }} />}
              label="TOP RATED CHOICES"
              sx={{ bgcolor: "rgba(239, 68, 68, 0.1)", color: "#ef4444", fontWeight: 800, mb: 1.5 }}
            />
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              Popular Dining Creations
            </Typography>
          </div>
          <Button
            variant="outlined"
            onClick={() => navigate("/products")}
            sx={{ fontWeight: 700, borderRadius: 3, borderColor: "#0f172a", color: "#0f172a" }}
          >
            Explore Full Menu &rarr;
          </Button>
        </Box>

        {/* Cards Grid */}
        <Grid container spacing={3.5}>
          {populars.map((dish) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={dish.id}>
              <Card
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  border: "1px solid #e2e8f0",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-6px)", boxShadow: "0 16px 32px rgba(15,23,42,0.12)", borderColor: "#f59e0b" },
                }}
              >
                <CardMedia component="img" height="200" image={dish.image} alt={dish.name} sx={{ objectFit: "cover" }} />
                <CardContent sx={{ p: 2.5, flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.8, fontSize: "1.05rem" }}>
                      {dish.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: "0.85rem" }}>
                      {dish.desc}
                    </Typography>
                  </div>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pt: 1, borderTop: "1px solid #f1f5f9" }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
                      ${dish.price.toFixed(2)}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => navigate(`/products/${dish.id}`)}
                      startIcon={<AddShoppingCartIcon />}
                      sx={{ borderRadius: 2, fontWeight: 700 }}
                    >
                      View
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
