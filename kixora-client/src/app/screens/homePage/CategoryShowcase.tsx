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
      image: "/img/kixora/sneakers.jpg",
    },
    {
      title: "Running",
      tagline: "Ultra Lightweight Foam",
      collection: ProductCollection.RUNNING,
      image: "/img/kixora/running.jpg",
    },
    {
      title: "Boots",
      tagline: "Tactical & All-Weather",
      collection: ProductCollection.BOOTS,
      image: "/img/kixora/boots.jpg",
    },
    {
      title: "Limited Drop",
      tagline: "Rare Concepts & VIP",
      collection: ProductCollection.LIMITED_DROP,
      image: "/img/kixora/limited.jpg",
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
            CURATED COLLECTIONS
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
                  position: "relative",
                  borderRadius: 4,
                  minHeight: 260,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  p: 3,
                  cursor: "pointer",
                  overflow: "hidden",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 16px 36px rgba(0,0,0,0.18)",
                    "& .cat-bg": {
                      transform: "scale(1.08)",
                    },
                  },
                }}
              >
                {/* Background High-Res Image */}
                <Box
                  className="cat-bg"
                  component="img"
                  src={cat.image}
                  alt={cat.title}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.4s ease",
                    zIndex: 0,
                  }}
                />

                {/* Dark Vignette Overlay for Text Readability */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)",
                    zIndex: 1,
                  }}
                />

                {/* Foreground Content */}
                <Box sx={{ position: "relative", zIndex: 2, color: "#ffffff" }}>
                  <Typography variant="caption" sx={{ color: "#d1d5db", fontWeight: 700, letterSpacing: "0.08em", fontSize: "0.75rem" }}>
                    {cat.tagline}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>
                    {cat.title}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, fontWeight: 800, fontSize: "0.85rem", color: "#ffffff" }}>
                    <span>Explore Drop</span>
                    <ArrowForwardIcon sx={{ fontSize: 16 }} />
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
