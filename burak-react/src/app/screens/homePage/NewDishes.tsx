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
import { useNavigate } from "react-router-dom";

export function NewDishes() {
  const navigate = useNavigate();

  const newItems = [
    {
      id: 5,
      name: "Molten Cheese Kunefe & Maraş Cream",
      price: 13.0,
      image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80",
      desc: "Crisp shredded pastry with melted Turkish goat cheese & orange blossom syrup.",
      tag: "NEW DESSERT",
    },
    {
      id: 6,
      name: "Fresh Frosted Ottoman Ayran",
      price: 5.0,
      image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80",
      desc: "Whipped salted yogurt beverage served in frosted hammered copper chalices.",
      tag: "SIGNATURE DRINK",
    },
    {
      id: 8,
      name: "Grand Turkish Mezze Banquet",
      price: 22.0,
      image: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80",
      desc: "Fresh hummus, babaganoush, atom labneh, and piping hot tandoor flatbread.",
      tag: "CHEF SELECTION",
    },
    {
      id: 7,
      name: "Black Sea Bergamot Infused Tea",
      price: 6.5,
      image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
      desc: "Authentic double-pot organic Rize black tea with authentic Turkish delights.",
      tag: "HOT BEVERAGE",
    },
  ];

  return (
    <Box sx={{ py: 8, bgcolor: "#f8fafc" }}>
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Chip
            icon={<SparklesIcon sx={{ color: "#f59e0b !important" }} />}
            label="FRESH FROM THE KITCHEN"
            sx={{ bgcolor: "rgba(245, 158, 11, 0.1)", color: "#d97706", fontWeight: 800, mb: 1.5 }}
          />
          <Typography variant="h3" sx={{ fontWeight: 800 }}>
            New Seasonal Arrivals
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: "auto", mt: 1 }}>
            Taste the latest handcrafted additions to our winter menu, meticulously prepared by Executive Chef Burak.
          </Typography>
        </Box>

        {/* Grid Cards */}
        <Grid container spacing={3.5}>
          {newItems.map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.id}>
              <Card
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  border: "1px solid #e2e8f0",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-6px)", boxShadow: "0 16px 32px rgba(15,23,42,0.1)", borderColor: "#f59e0b" },
                }}
              >
                <CardMedia component="img" height="190" image={item.image} alt={item.name} sx={{ objectFit: "cover" }} />
                <CardContent sx={{ p: 2.5, flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <Chip label={item.tag} size="small" color="primary" sx={{ fontSize: "0.7rem", fontWeight: 800, mb: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.8, fontSize: "1.02rem" }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: "0.85rem" }}>
                      {item.desc}
                    </Typography>
                  </div>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pt: 1, borderTop: "1px solid #f1f5f9" }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
                      ${item.price.toFixed(2)}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => navigate(`/products/${item.id}`)}
                      sx={{ borderRadius: 2, fontWeight: 700 }}
                    >
                      Details
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
