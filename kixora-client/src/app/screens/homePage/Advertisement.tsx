import { useSelector } from "react-redux";
import { Box, Container, Typography, Button, Grid } from "@mui/material";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import { retrievePopularDishes } from "./selector";
import { getImageUrl } from "../../../lib/config";

export function Advertisement() {
  const popularDishes = useSelector(retrievePopularDishes);
  const featuredDish = popularDishes?.[0];
  const featuredImage = getImageUrl(featuredDish?.productImages?.[0]);

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            background: "linear-gradient(135deg, #090a0f 0%, #171b26 100%)",
            color: "#fff",
            borderRadius: 5,
            p: { xs: 4, md: 8 },
            position: "relative",
            overflow: "hidden",
            border: "1px solid rgba(255, 70, 85, 0.25)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
          }}
        >
          <Grid container spacing={4} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography variant="overline" sx={{ color: "#ff4655", fontWeight: 800, letterSpacing: 2 }}>
                KIXORA INNOVATION & LABS
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, my: 2, fontSize: { xs: "2rem", md: "2.8rem" } }}>
                Aerodynamic Carbon Plates & Explosive Kinetic Energy
              </Typography>
              <Typography variant="body1" sx={{ color: "#94a3b8", mb: 4, lineHeight: 1.8 }}>
                Experience 85% energy return with dual-density foam technology. Designed for maximum agility, street durability, and zero fatigue during all-day wear.
              </Typography>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<WhatsAppIcon />}
                  sx={{ borderRadius: 3, px: 3.5, fontWeight: 800, bgcolor: "#ff4655", "&:hover": { bgcolor: "#e02d3c" } }}
                  onClick={() => window.open("https://wa.me", "_blank")}
                >
                  VIP Sneaker Concierge
                </Button>
                <Button
                  variant="outlined"
                  sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)", borderRadius: 3, px: 3 }}
                  startIcon={<PlayCircleFilledWhiteIcon />}
                  onClick={() => window.open("https://youtube.com", "_blank")}
                >
                  Watch Tech Film
                </Button>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
                  border: "2px solid rgba(255,70,85,0.2)",
                  height: 320,
                  bgcolor: "#090a0f",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 2,
                }}
              >
                {featuredImage ? (
                  <Box
                    component="img"
                    src={featuredImage}
                    alt={featuredDish?.productName || "KIXORA Innovation"}
                    sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                ) : (
                  <Box sx={{ textAlign: "center", p: 3 }}>
                    <FlashOnIcon sx={{ fontSize: 64, color: "#ff4655", mb: 1.5 }} />
                    <Typography variant="h6" sx={{ fontWeight: 800, color: "#fff" }}>
                      KIXORA CARBON MOTION
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.5 }}>
                      Next-Gen Athletic Engineering
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

