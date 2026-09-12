import { Container, Typography, Box, Button, Grid, Card, CardContent, Chip } from "@mui/material";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import StarIcon from "@mui/icons-material/Star";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useNavigate } from "react-router-dom";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        {/* Luxury Hero Section */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #090d16 0%, #111827 50%, #1e293b 100%)",
            color: "#fff",
            p: { xs: 4, md: 8 },
            borderRadius: 5,
            mb: 6,
            position: "relative",
            overflow: "hidden",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.25)",
          }}
        >
          {/* Subtle Glow Orb in background */}
          <Box
            sx={{
              position: "absolute",
              top: -60,
              right: -60,
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0) 70%)",
              filter: "blur(40px)",
              pointerEvents: "none",
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1, maxWidth: 720 }}>
            <Chip
              icon={<VerifiedIcon sx={{ color: "#f59e0b !important" }} />}
              label="AUTHENTIC TURKISH FLAVORS"
              sx={{
                bgcolor: "rgba(245, 158, 11, 0.15)",
                color: "#f59e0b",
                fontWeight: 800,
                letterSpacing: 1.5,
                mb: 3,
                border: "1px solid rgba(245, 158, 11, 0.3)",
              }}
            />

            <Typography
              variant="h2"
              sx={{
                my: 2,
                fontWeight: 800,
                fontSize: { xs: "2.2rem", md: "3.8rem" },
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
              }}
            >
              Experience the Culinary Art of <span style={{ color: "#f59e0b" }}>Burak</span>
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "#94a3b8",
                mb: 4,
                maxWidth: 620,
                fontSize: { xs: "1rem", md: "1.15rem" },
                lineHeight: 1.7,
              }}
            >
              Handcrafted kebabs, sizzling dry-aged steaks, Gaziantep pistachio baklavas, and fresh specialties prepared with passion, spectacle, and authentic tradition.
            </Typography>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => navigate("/products")}
                startIcon={<RestaurantMenuIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                  borderRadius: 3,
                  fontWeight: 800,
                  boxShadow: "0 8px 24px rgba(245, 158, 11, 0.35)",
                }}
              >
                Order Online Now
              </Button>
              <Button
                variant="outlined"
                sx={{
                  color: "#fff",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  px: 3.5,
                  py: 1.5,
                  fontSize: "1rem",
                  borderRadius: 3,
                  fontWeight: 700,
                  "&:hover": { borderColor: "#f59e0b", bgcolor: "rgba(245, 158, 11, 0.08)" },
                }}
                onClick={() => navigate("/orders")}
                startIcon={<DeliveryDiningIcon />}
              >
                Track Live Order
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Feature Cards Grid */}
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                p: 2,
                height: "100%",
                borderRadius: 4,
                border: "1px solid #e2e8f0",
                transition: "0.3s",
                "&:hover": { transform: "translateY(-5px)", boxShadow: "0 12px 30px rgba(0,0,0,0.08)" },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 3,
                    bgcolor: "rgba(245, 158, 11, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2.5,
                  }}
                >
                  <LocalFireDepartmentIcon sx={{ fontSize: 32, color: "primary.main" }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.2 }}>
                  Artisan Wood-Fired Menu
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Prime cut steaks, wood-fired special dishes, and legendary oversized Turkish creations made with unmatched passion.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                p: 2,
                height: "100%",
                borderRadius: 4,
                border: "1px solid #e2e8f0",
                transition: "0.3s",
                "&:hover": { transform: "translateY(-5px)", boxShadow: "0 12px 30px rgba(0,0,0,0.08)" },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 3,
                    bgcolor: "rgba(16, 185, 129, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2.5,
                  }}
                >
                  <DeliveryDiningIcon sx={{ fontSize: 32, color: "#10b981" }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.2 }}>
                  Thermal Express Delivery
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Fast, temperature-controlled insulated delivery bringing freshly grilled delicacies piping hot straight to your door.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                p: 2,
                height: "100%",
                borderRadius: 4,
                border: "1px solid #e2e8f0",
                transition: "0.3s",
                "&:hover": { transform: "translateY(-5px)", boxShadow: "0 12px 30px rgba(0,0,0,0.08)" },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 3,
                    bgcolor: "rgba(59, 130, 246, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2.5,
                  }}
                >
                  <StarIcon sx={{ fontSize: 32, color: "#3b82f6" }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.2 }}>
                  5-Star Hospitality
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Unmatched hospitality, VIP guest care, and world-class dining celebrated by millions of food lovers globally.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
