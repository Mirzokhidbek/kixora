import { useState, useEffect } from "react";
import { Box, Container, Typography, Button, Grid, IconButton } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";

export function HeroBanner() {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const heroSlides = [
    {
      tag: "FLAGSHIP PERFORMANCE",
      title: "Velocity Air Pro",
      desc: "Engineered with aerodynamic carbon plates and responsive cushioning for unstoppable motion.",
      image: "/img/kixora/hero.jpg",
    },
    {
      tag: "STREETWEAR LUXURY",
      title: "Street Low Classic",
      desc: "Clean minimalist silhouettes crafted from premium calfskin leather and cushioned gum sole.",
      image: "/img/kixora/sneakers.jpg",
    },
    {
      tag: "ATHLETIC INNOVATION",
      title: "Aero-Flow 8K",
      desc: "Ultra lightweight running shoes designed for marathon endurance and explosive energy return.",
      image: "/img/kixora/running.jpg",
    },
    {
      tag: "LIMITED CONCEPT",
      title: "Aether VIP Drop",
      desc: "Rare limited release featuring iridescent chrome accents and futuristic air chamber sole.",
      image: "/img/kixora/limited.jpg",
    },
  ];

  // Auto-play carousel every 4.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, heroSlides.length]);

  const currentSlide = heroSlides[activeSlide];

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <Box
      sx={{
        py: { xs: 3, md: 6 },
        bgcolor: "#ffffff",
        position: "relative",
      }}
    >
      <Container maxWidth="lg">
        {/* Main Hero Carousel Container */}
        <Box
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          sx={{
            bgcolor: "#000000",
            color: "#ffffff",
            borderRadius: { xs: 4, md: 6 },
            p: { xs: 3.5, sm: 5, md: 7 },
            position: "relative",
            overflow: "hidden",
            minHeight: { xs: 460, md: 520 },
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Ambient Lighting Background */}
          <Box
            sx={{
              position: "absolute",
              top: "-15%",
              right: "-10%",
              width: "55%",
              height: "130%",
              background: "radial-gradient(circle, rgba(255, 255, 255, 0.09) 0%, transparent 65%)",
              filter: "blur(60px)",
              pointerEvents: "none",
            }}
          />

          <Grid container spacing={{ xs: 4, md: 5 }} sx={{ alignItems: "center", position: "relative", zIndex: 1 }}>
            {/* Left Column: Bold Typography & Action */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ maxWidth: 480 }}>
                {/* Clean Tag */}
                <Box
                  sx={{
                    display: "inline-block",
                    px: 1.8,
                    py: 0.5,
                    borderRadius: 9999,
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    bgcolor: "rgba(255, 255, 255, 0.08)",
                    mb: 2.5,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#e5e7eb",
                      fontWeight: 800,
                      letterSpacing: "0.14em",
                      fontSize: "0.72rem",
                      textTransform: "uppercase",
                    }}
                  >
                    {currentSlide.tag}
                  </Typography>
                </Box>

                {/* Main Headline */}
                <Typography
                  variant="h1"
                  sx={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 900,
                    fontSize: { xs: "2.5rem", sm: "3.2rem", md: "4rem" },
                    lineHeight: 1.02,
                    letterSpacing: "-0.03em",
                    color: "#ffffff",
                    mb: 2,
                  }}
                >
                  STEP INTO <br />
                  <span style={{ color: "#ffffff", textDecoration: "underline", textDecorationThickness: "4px" }}>
                    MORE.
                  </span>
                </Typography>

                {/* Subtitle */}
                <Typography
                  variant="body1"
                  sx={{
                    color: "#9ca3af",
                    fontSize: { xs: "0.95rem", md: "1.05rem" },
                    lineHeight: 1.6,
                    mb: 4,
                  }}
                >
                  {currentSlide.desc}
                </Typography>

                {/* Single Clean Call To Action Button (No Price / No Dish) */}
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
              </Box>
            </Grid>

            {/* Right Column: Interactive Image Carousel */}
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
                <Box
                  component="img"
                  key={activeSlide}
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  onError={(e: any) => {
                    e.target.src = "/img/kixora/hero.jpg";
                  }}
                  sx={{
                    width: "100%",
                    maxWidth: { xs: 320, sm: 420, md: 480 },
                    maxHeight: { xs: 250, sm: 330, md: 370 },
                    objectFit: "contain",
                    filter: "drop-shadow(0 20px 30px rgba(0, 0, 0, 0.7))",
                    transform: "rotate(-10deg)",
                    animation: "fadeIn 0.5s ease-in-out",
                    cursor: "pointer",
                    transition: "transform 0.4s ease",
                    "&:hover": { transform: "rotate(-5deg) scale(1.04)" },
                    "@keyframes fadeIn": {
                      from: { opacity: 0.2, transform: "scale(0.95) rotate(-14deg)" },
                      to: { opacity: 1, transform: "scale(1) rotate(-10deg)" },
                    },
                  }}
                  onClick={() => navigate("/products")}
                />
              </Box>
            </Grid>
          </Grid>

          {/* Bottom Indicators & Navigation */}
          <Box
            sx={{
              position: "absolute",
              bottom: { xs: 14, md: 24 },
              right: { xs: 16, md: 36 },
              display: "flex",
              alignItems: "center",
              gap: 2,
              zIndex: 2,
            }}
          >
            {/* Dots */}
            <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1, mr: 1 }}>
              {heroSlides.map((_, idx) => (
                <Box
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  sx={{
                    width: idx === activeSlide ? 24 : 8,
                    height: 8,
                    borderRadius: 9999,
                    bgcolor: idx === activeSlide ? "#ffffff" : "rgba(255, 255, 255, 0.3)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </Box>

            {/* Slide Index (01 / 04) */}
            <Typography variant="caption" sx={{ color: "#9ca3af", fontWeight: 800, letterSpacing: 2 }}>
              0{activeSlide + 1} / 0{heroSlides.length}
            </Typography>

            {/* Prev / Next Arrows */}
            <Box sx={{ display: "flex", gap: 0.6 }}>
              <IconButton
                size="small"
                onClick={handlePrev}
                sx={{
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.25)",
                  p: 0.6,
                  "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
                }}
              >
                <ArrowBackIosNewIcon sx={{ fontSize: 12 }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={handleNext}
                sx={{
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.25)",
                  p: 0.6,
                  "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
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
