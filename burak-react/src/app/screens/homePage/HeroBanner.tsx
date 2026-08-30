import { Box, Container, Typography, Button, Grid } from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useNavigate } from "react-router-dom";

export function HeroBanner() {
  const navigate = useNavigate();

  const satelliteDishes = [
    {
      img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=300&q=80",
      top: "8%",
      right: "2%",
      size: 100,
    },
    {
      img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=300&q=80",
      top: "28%",
      left: "2%",
      size: 90,
    },
    {
      img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80",
      bottom: "28%",
      left: "4%",
      size: 85,
    },
    {
      img: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=300&q=80",
      bottom: "4%",
      left: "22%",
      size: 90,
    },
  ];

  return (
    <Box
      sx={{
        py: { xs: 4, md: 10 },
        bgcolor: "#ffffff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 5, md: 8 }} sx={{ alignItems: "center" }}>
          {/* Left Column: Big Orbiting Plate Showcase */}
          <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 2, md: 1 } }}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                maxWidth: { xs: 340, sm: 460, md: 520 },
                aspectRatio: "1/1",
                mx: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Flame / Spice Embers Petals */}
              <Box
                sx={{
                  position: "absolute",
                  top: "4%",
                  left: "30%",
                  width: { xs: 16, sm: 22 },
                  height: { xs: 28, sm: 38 },
                  borderRadius: "50% 50% 50% 0",
                  transform: "rotate(-35deg)",
                  background: "linear-gradient(135deg, #f97316 0%, #ef4444 100%)",
                  boxShadow: "0 4px 12px rgba(249, 115, 22, 0.4)",
                  animation: "floatSlow 4s ease-in-out infinite",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: "0%",
                  left: "45%",
                  width: { xs: 18, sm: 26 },
                  height: { xs: 32, sm: 44 },
                  borderRadius: "50% 50% 50% 0",
                  transform: "rotate(15deg)",
                  background: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
                  boxShadow: "0 4px 14px rgba(245, 158, 11, 0.4)",
                  animation: "floatSlow 3.5s ease-in-out infinite 0.5s",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: "6%",
                  right: "32%",
                  width: { xs: 14, sm: 20 },
                  height: { xs: 24, sm: 34 },
                  borderRadius: "50% 50% 50% 0",
                  transform: "rotate(45deg)",
                  background: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
                  boxShadow: "0 4px 12px rgba(245, 158, 11, 0.4)",
                  animation: "floatSlow 4.2s ease-in-out infinite 1s",
                }}
              />

              {/* Orbiting Golden Ring Arc */}
              <Box
                sx={{
                  position: "absolute",
                  width: "92%",
                  height: "92%",
                  borderRadius: "50%",
                  border: "3.5px solid transparent",
                  borderLeftColor: "#ef4444",
                  borderBottomColor: "#f59e0b",
                  borderRightColor: "#fbbf24",
                  transform: "rotate(-25deg)",
                  zIndex: 0,
                }}
              />

              {/* Center Main Signature Bowl Plate */}
              <Box
                sx={{
                  width: { xs: "68%", sm: "74%" },
                  height: { xs: "68%", sm: "74%" },
                  borderRadius: "50%",
                  overflow: "hidden",
                  boxShadow: "0 25px 60px rgba(0, 0, 0, 0.16), 0 0 40px rgba(245, 158, 11, 0.15)",
                  border: { xs: "5px solid #ffffff", sm: "8px solid #ffffff" },
                  position: "relative",
                  zIndex: 2,
                  transition: "transform 0.5s ease",
                  "&:hover": { transform: "scale(1.03)" },
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80"
                  alt="Burak Signature Dish"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>

              {/* Orbiting Satellite Miniature Plates */}
              {satelliteDishes.map((dish, idx) => (
                <Box
                  key={idx}
                  sx={{
                    position: "absolute",
                    top: dish.top,
                    bottom: dish.bottom,
                    left: dish.left,
                    right: dish.right,
                    width: { xs: dish.size * 0.65, sm: dish.size * 0.85, md: dish.size },
                    height: { xs: dish.size * 0.65, sm: dish.size * 0.85, md: dish.size },
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: { xs: "2.5px solid #ffffff", sm: "4px solid #ffffff" },
                    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                    zIndex: 3,
                    bgcolor: "#fff",
                    transition: "transform 0.3s ease",
                    "&:hover": { transform: "scale(1.12)" },
                  }}
                >
                  <Box
                    component="img"
                    src={dish.img}
                    alt="Satellite Dish"
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Right Column: Hero Typography & Actions */}
          <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 1, md: 2 } }}>
            <Box sx={{ maxWidth: 540, textAlign: { xs: "center", md: "left" } }}>
              <Typography
                variant="h1"
                sx={{
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 900,
                  fontSize: { xs: "2.1rem", sm: "2.8rem", md: "3.6rem" },
                  lineHeight: 1.18,
                  color: "#0f172a",
                  mb: 2,
                  letterSpacing: "-0.02em",
                }}
              >
                Happy With{" "}
                <span style={{ color: "#f59e0b" }}>Delicious</span>{" "}
                <span style={{ color: "#f59e0b" }}>Food</span> And Get New Experiences With{" "}
                <span>Burak Gastronomy</span>
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "#64748b",
                  fontSize: { xs: "0.92rem", md: "1.05rem" },
                  lineHeight: 1.7,
                  mb: 3.5,
                  fontWeight: 500,
                }}
              >
                Exploring authentic wood-fired feasts, giant steak cuts, and rich handcrafted Ottoman recipes crafted with love by Chef CZN Burak right at your table.
              </Typography>

              {/* CTA Action Buttons */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                  justifyContent: { xs: "center", md: "flex-start" },
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ShoppingCartOutlinedIcon />}
                  onClick={() => navigate("/products")}
                  sx={{
                    bgcolor: "#eab308",
                    color: "#ffffff",
                    fontWeight: 800,
                    fontSize: { xs: "0.95rem", sm: "1.05rem" },
                    px: { xs: 3, sm: 4 },
                    py: 1.4,
                    borderRadius: 3,
                    boxShadow: "0 10px 25px rgba(234, 179, 8, 0.4)",
                    "&:hover": {
                      bgcolor: "#ca8a04",
                      boxShadow: "0 14px 30px rgba(234, 179, 8, 0.5)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  Order Food
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate("/products")}
                  sx={{
                    color: "#0f172a",
                    borderColor: "#e2e8f0",
                    borderWidth: 2,
                    fontWeight: 700,
                    fontSize: { xs: "0.95rem", sm: "1.05rem" },
                    px: { xs: 3, sm: 3.5 },
                    py: 1.3,
                    borderRadius: 3,
                    bgcolor: "#ffffff",
                    "&:hover": {
                      borderColor: "#0f172a",
                      borderWidth: 2,
                      bgcolor: "#f8fafc",
                    },
                  }}
                >
                  Learn More
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
