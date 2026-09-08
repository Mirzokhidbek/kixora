import { useState, useEffect } from "react";
import { Box, Container, Typography, Button, Grid, IconButton } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";

export function HeroBanner() {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);

  // 5 Dedicated Permanent High-End Brand Slides (Pure Black Background)
  const heroSlides = [
    {
      tag: "FLAGSHIP PERFORMANCE",
      title: "Velocity Air Pro",
      desc: "Engineered with aerodynamic carbon plates and responsive cushioning for unstoppable motion.",
      image: "/img/kixora/slide1.jpg",
    },
    {
      tag: "STREETWEAR LUXURY",
      title: "Street Low Classic",
      desc: "Clean minimalist silhouettes crafted from premium calfskin leather and cushioned gum sole.",
      image: "/img/kixora/slide2.jpg",
    },
    {
      tag: "ATHLETIC INNOVATION",
      title: "Aero-Flow 8K",
      desc: "Ultra lightweight running shoes designed for marathon endurance and explosive energy return.",
      image: "/img/kixora/slide3.jpg",
    },
    {
      tag: "TACTICAL LUXURY",
      title: "Tactical High-Top Boot",
      desc: "Matte black ballistic Italian leather with all-weather traction sole for rugged urban dominance.",
      image: "/img/kixora/slide4.jpg",
    },
    {
      tag: "LIMITED CONCEPT",
      title: "Futr Cyber Low",
      desc: "Next-gen concept sneaker with dual neon accents and dynamic impact absorption chassis.",
      image: "/img/kixora/slide5.jpg",
    },
  ];

  // Auto-play carousel every 3.8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

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
        {/* Main Hero Container - Pure Solid Black */}
        <Box
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
          {/* Subtle Ambient Radial Lighting */}
          <Box
            sx={{
              position: "absolute",
              top: "-20%",
              right: "-10%",
              width: "60%",
              height: "140%",
              background: "radial-gradient(circle, rgba(255, 255, 255, 0.06) 0%, transparent 70%)",
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

                {/* CTA Button */}
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

            {/* Right Column: 5 Pure Black Seamless Floating Shoes */}
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
                {heroSlides.map((slide, idx) => (
                  <Box
                    key={idx}
                    component="img"
                    src={slide.image}
                    alt={slide.title}
                    onError={(e: any) => {
                      e.target.src = "/img/kixora/slide1.jpg";
                    }}
                    sx={{
                      position: idx === activeSlide ? "relative" : "absolute",
                      width: "100%",
                      maxWidth: { xs: 340, sm: 440, md: 500 },
                      maxHeight: { xs: 260, sm: 340, md: 380 },
                      objectFit: "contain",
                      opacity: idx === activeSlide ? 1 : 0,
                      transform: idx === activeSlide ? "scale(1) rotate(0deg)" : "scale(0.92) rotate(-5deg)",
                      transition: "opacity 0.7s ease-in-out, transform 0.7s ease-in-out",
                      filter: "drop-shadow(0 15px 25px rgba(0, 0, 0, 0.9))",
                      pointerEvents: idx === activeSlide ? "auto" : "none",
                      cursor: "pointer",
                      "&:hover": { transform: "scale(1.04)" },
                    }}
                    onClick={() => navigate("/products")}
                  />
                ))}
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
            {/* Dots Indicator */}
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

            {/* Slide Index (01 / 05) */}
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
