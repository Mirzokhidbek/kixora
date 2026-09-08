import { Box, Container, Typography, Grid, Card } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { ProductCollection } from "../../../lib/enums/common.enum";

export function CategoryShowcase() {
  const navigate = useNavigate();

  const categories = [
    {
      title: "Sneakers",
      tagline: "Street & Performance",
      collection: ProductCollection.SNEAKERS,
      bgColor: "#111827",
      textColor: "#ffffff",
    },
    {
      title: "Running",
      tagline: "Ultra Lightweight",
      collection: ProductCollection.RUNNING,
      bgColor: "#f3f4f6",
      textColor: "#111827",
    },
    {
      title: "Boots",
      tagline: "All-Weather Durability",
      collection: ProductCollection.BOOTS,
      bgColor: "#1f2937",
      textColor: "#ffffff",
    },
    {
      title: "Limited Drop",
      tagline: "Exclusive Releases",
      collection: ProductCollection.LIMITED_DROP,
      bgColor: "#000000",
      textColor: "#ffffff",
    },
  ];

  return (
    <Box sx={{ py: 8, bgcolor: "#ffffff" }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography
            variant="caption"
            sx={{
              color: "#6b7280",
              fontWeight: 800,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontSize: "0.78rem",
            }}
          >
            COLLECTIONS
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              color: "#000000",
              fontSize: { xs: "1.8rem", md: "2.4rem" },
              letterSpacing: "-0.03em",
              mt: 0.5,
            }}
          >
            Explore Categories
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {categories.map((cat, idx) => (
            <Grid key={idx} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                onClick={() => navigate(`/products`)}
                sx={{
                  bgcolor: cat.bgColor,
                  color: cat.textColor,
                  borderRadius: 4,
                  p: 3.5,
                  minHeight: 180,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  border: cat.bgColor === "#ffffff" ? "1px solid #e5e7eb" : "none",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <Box>
                  <Typography variant="caption" sx={{ opacity: 0.7, fontWeight: 700, letterSpacing: "0.08em" }}>
                    {cat.tagline}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 900, mt: 0.5 }}>
                    {cat.title}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, fontWeight: 800, fontSize: "0.88rem" }}>
                  <span>Explore</span>
                  <ArrowForwardIcon sx={{ fontSize: 16 }} />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
