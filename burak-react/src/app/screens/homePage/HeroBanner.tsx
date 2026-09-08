import { useState } from "react";
import { useSelector } from "react-redux";
import { Box, Container, Typography, Button, Grid, IconButton } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";
import { retrievePopularDishes } from "./selector";
import { serverApi } from "../../../lib/config";

export function HeroBanner() {
  const navigate = useNavigate();
  const popularDishes = useSelector(retrievePopularDishes);
  const [activeSlide, setActiveSlide] = useState(0);

  const getImageSrc = (img?: string) => {
    if (!img) return "";
    return img.startsWith("http") ? img : `${serverApi}/${img}`;
  };

  const slides = popularDishes && popularDishes.length > 0
    ? popularDishes.slice(0, 3)
    : [
        {
          _id: "demo-1",
          productName: "KIXORA Velocity Air Pro",
          productPrice: 180,
          productCollection: "LIMITED DROP",
          productImages: [],
        },
      ];

  const currentItem = slides[activeSlide % slides.length];
  const currentImage = currentItem?.productImages?.[0]
    ? getImageSrc(currentItem.productImages[0])
    : "/img/kixora/hero.jpg";

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <Box
      sx={{
        py: { xs: 4, md: 7 },
        bgcolor: "#ffffff",
        position: "relative",
      }}
    >
      <Container maxWidth="lg">
        {/* Main Hero Container */}
        <Box
          sx={{
            bgcolor: "#000000",
            color: "#ffffff",
            borderRadius: { xs: 4, md: 6 },
            p: { xs: 4, sm: 6, md: 8 },
            position: "relative",
            overflow: "hidden",
            minHeight: { xs: 480, md: 540 },
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Subtle Ambient Background Gradient */}
          <Box
            sx={{
              position: "absolute",
              top: "-20%",
              right: "-10%",
              width: "60%",
              height: "120%",
              background: "radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 60%)",
              filter: "blur(60px)",
              pointerEvents: "none",
            }}
          />

          <Grid container spacing={{ xs: 4, md: 6 }} sx={{ alignItems: "center", position: "relative", zIndex: 1 }}>
            {/* Left Column: Bold Typography & CTA */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ maxWidth: 480 }}>
                <Box
                  sx={{
                    display: "inline-block",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 9999,
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    bgcolor: "rgba(255, 255, 255, 0.06)",
                    mb: 2.5,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#e5e7eb",
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      fontSize: "0.72rem",
                      textTransform: "uppercase",
                    }}
                  >
                    {currentItem?.productCollection || "SEASON 2026 DROPS"}
                  </Typography>
                </Box>

                <Typography
                  variant="h1"
                  sx={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 900,
                    fontSize: { xs: "2.5rem", sm: "3.2rem", md: "4rem" },
                    lineHeight: 1.02,
                    letterSpacing: "-0.03em",
                    color: "#ffffff",
                    mb: 2.5,
                  }}
                >
                  STEP INTO <br />
                  <span style={{ color: "#ffffff", textDecoration: "underline", textDecorationThickness: "4px" }}>
                    MORE.
                  </span>
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: "#9ca3af",
                    fontSize: { xs: "0.95rem", md: "1.1rem" },
                    lineHeight: 1.6,
                    mb: 4,
                  }}
                >
                  Premium shoes engineered for every journey. Style. Comfort. Performance. Crafted for the modern sneaker enthusiast.
                </Typography>

                {/* CTA Buttons */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate("/products")}
                    sx={{
                      bgcolor: "#ffffff",
                      color: "#000000",
                      borderRadius: 9999,
                      px: { xs: 3.5, sm: 4.5 },
                      py: 1.5,
                      fontWeight: 800,
                      fontSize: "0.95rem",
                      textTransform: "none",
                      boxShadow: "0 10px 30px rgba(255,255,255,0.15)",
                      "&:hover": {
                        bgcolor: "#f3f4f6",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    Shop Now
                  </Button>

                  {currentItem?._id && currentItem._id !== "demo-1" && (
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate(`/products/${currentItem._id}`)}
                      sx={{
                        borderColor: "rgba(255, 255, 255, 0.3)",
                        color: "#ffffff",
                        borderRadius: 9999,
                        px: 3,
                        py: 1.5,
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        textTransform: "none",
                        "&:hover": {
                          borderColor: "#ffffff",
                          bgcolor: "rgba(255, 255, 255, 0.05)",
                        },
                      }}
                    >
                      View Drop &bull; ${currentItem.productPrice}
                    </Button>
                  )}
                </Box>
              </Box>
            </Grid>

            {/* Right Column: Hero Sneaker Visual */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: { xs: 240, sm: 320, md: 380 },
                }}
              >
                {currentImage ? (
                  <Box
                    component="img"
                    src={currentImage}
                    alt={currentItem?.productName || "Sneaker Showcase"}
                    sx={{
                      width: "100%",
                      maxWidth: { xs: 320, sm: 420, md: 500 },
                      maxHeight: { xs: 260, sm: 340, md: 400 },
                      objectFit: "contain",
                      filter: "drop-shadow(0 25px 35px rgba(0, 0, 0, 0.7))",
                      transform: "rotate(-12deg)",
                      transition: "transform 0.4s ease",
                      "&:hover": { transform: "rotate(-6deg) scale(1.04)" },
                      cursor: "pointer",
                    }}
                    onClick={() => currentItem?._id && navigate(`/products/${currentItem._id}`)}
                  />
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      height: 300,
                      borderRadius: 4,
                      bgcolor: "rgba(255,255,255,0.04)",
                      border: "1px dashed rgba(255,255,255,0.15)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      p: 3,
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: "#ffffff" }}>
                      KIXORA SIGNATURE
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#9ca3af" }}>
                      Upload sneaker photos in the Admin Portal to showcase them here dynamically.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>

          {/* Bottom Slider Nav & Indicator (Figma 01 / 03) */}
          <Box
            sx={{
              position: "absolute",
              bottom: { xs: 16, md: 24 },
              right: { xs: 20, md: 36 },
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              zIndex: 2,
            }}
          >
            <Typography variant="caption" sx={{ color: "#9ca3af", fontWeight: 700, letterSpacing: 2 }}>
              0{activeSlide + 1} / 0{Math.max(1, slides.length)}
            </Typography>

            <Box sx={{ display: "flex", gap: 0.5 }}>
              <IconButton
                size="small"
                onClick={handlePrev}
                sx={{
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.2)",
                  p: 0.6,
                  "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                }}
              >
                <ArrowBackIosNewIcon sx={{ fontSize: 12 }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={handleNext}
                sx={{
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.2)",
                  p: 0.6,
                  "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                }}
              >
                <ArrowForwardIosIcon sx={{ fontSize: 12 }} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
