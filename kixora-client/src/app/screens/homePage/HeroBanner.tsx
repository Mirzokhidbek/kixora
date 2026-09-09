/**
 * ============================================================================
 * HeroBanner.tsx - Clean Light Studio Footwear Carousel
 * ============================================================================
 * 100% Transparent Shoe Assets (no background box), perfectly proportioned
 * 3-column layout without overlap, and crisp typography.
 */

import { useState, useEffect } from "react";
import { Box, Container, Typography, Button, Grid, IconButton } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AirIcon from "@mui/icons-material/Air";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import ElectricBoltOutlinedIcon from "@mui/icons-material/ElectricBoltOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useNavigate } from "react-router-dom";
import { AISearchDialog } from "../../components/ai/AISearchDialog";

interface HeroBannerProps {
  onAdd?: (item: any) => void;
}

export function HeroBanner({ onAdd }: HeroBannerProps) {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [aiModalOpen, setAiModalOpen] = useState(false);


  // 3 Dedicated Studio Hero Slides with 100% Transparent PNG Shoes
  const heroSlides = [
    {
      tag: "ATHLETIC INNOVATION",
      title: "Nike Air ZoomX",
      desc: "Ultra lightweight running shoes designed for marathon endurance and explosive energy return.",
      image: "/img/kixora/hero_shoe1.png",
    },
    {
      tag: "STREETWEAR LUXURY",
      title: "Street Low Classic",
      desc: "Clean minimalist silhouettes crafted from premium calfskin leather and cushioned gum sole.",
      image: "/img/kixora/hero_shoe2.png",
    },
    {
      tag: "FLAGSHIP PERFORMANCE",
      title: "Air Jordan 1 Low Mocha",
      desc: "Timeless heritage silhouette engineered with encapsulated Air cushioning and premium leather.",
      image: "/img/kixora/hero_shoe4.png",
    },
  ];

  // Preload all transparent slide assets
  useEffect(() => {
    heroSlides.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });
  }, []);

  // Auto-play carousel every 4.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const currentSlide = heroSlides[activeSlide];

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const featureBadges = [
    {
      icon: <ElectricBoltOutlinedIcon sx={{ fontSize: 17, color: "#111827" }} />,
      title: "LIGHTWEIGHT",
      desc: "Less weight, more speed",
    },
    {
      icon: <AirIcon sx={{ fontSize: 17, color: "#111827" }} />,
      title: "BREATHABLE",
      desc: "Keeps your feet cool",
    },
    {
      icon: <ShieldOutlinedIcon sx={{ fontSize: 17, color: "#111827" }} />,
      title: "DURABLE",
      desc: "Built for the long run",
    },
  ];

  return (
    <Box
      sx={{
        py: { xs: 2, md: 4 },
        bgcolor: "#ffffff",
        position: "relative",
      }}
    >
      <Container maxWidth="lg">
        {/* Main Light Hero Container */}
        <Box
          sx={{
            bgcolor: "#F4F4F6",
            borderRadius: { xs: 4, md: 6 },
            p: { xs: 3, sm: 4, md: 5 },
            pb: { xs: 6, md: 6.5 },
            position: "relative",
            overflow: "hidden",
            minHeight: { xs: 460, md: 490 },
            display: "flex",
            alignItems: "center",
            border: "1px solid #E5E7EB",
          }}
        >
          {/* Subtle Faded Brand Watermark */}
          <Typography
            sx={{
              position: "absolute",
              top: "48%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: { xs: "24vw", md: "14vw" },
              fontWeight: 900,
              fontFamily: '"Outfit", sans-serif',
              color: "rgba(0, 0, 0, 0.035)",
              letterSpacing: "-0.04em",
              userSelect: "none",
              pointerEvents: "none",
              zIndex: 0,
            }}
          >
            NIKE
          </Typography>

          <Grid
            container
            spacing={{ xs: 3, md: 2 }}
            sx={{ alignItems: "center", position: "relative", zIndex: 1, width: "100%" }}
          >
            {/* Left Column: Headline & Action */}
            <Grid size={{ xs: 12, md: 4.5 }}>
              <Box sx={{ maxWidth: 390 }}>
                {/* Pill Tag */}
                <Box
                  sx={{
                    display: "inline-block",
                    px: 1.6,
                    py: 0.5,
                    borderRadius: 9999,
                    bgcolor: "rgba(0, 0, 0, 0.06)",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                    mb: 1.8,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#374151",
                      fontWeight: 800,
                      letterSpacing: "0.12em",
                      fontSize: "0.7rem",
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
                    fontSize: { xs: "2.3rem", sm: "2.9rem", md: "3.4rem" },
                    lineHeight: 1.05,
                    letterSpacing: "-0.03em",
                    color: "#111827",
                    mb: 1.5,
                  }}
                >
                  STEP INTO <br />
                  <span style={{ color: "#111827" }}>MORE</span>
                </Typography>

                {/* Subtitle */}
                <Box sx={{ minHeight: { xs: 44, sm: 52 }, mb: 3 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4b5563",
                      fontSize: { xs: "0.88rem", md: "0.95rem" },
                      lineHeight: 1.5,
                    }}
                  >
                    {currentSlide.desc}
                  </Typography>
                </Box>

                {/* Action Row: CTA Button + AI Search Trigger Bar */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.8 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                    <Button
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForwardIcon sx={{ fontSize: "16px !important" }} />}
                      onClick={() => navigate("/products")}
                      sx={{
                        bgcolor: "#000000",
                        color: "#ffffff",
                        borderRadius: 9999,
                        px: { xs: 3.2, sm: 3.8 },
                        py: 1.2,
                        fontWeight: 800,
                        fontSize: "0.88rem",
                        textTransform: "none",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                        "&:hover": {
                          bgcolor: "#262626",
                          transform: "translateY(-2px)",
                          boxShadow: "0 12px 25px rgba(0,0,0,0.25)",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      Shop Now
                    </Button>

                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<AutoAwesomeIcon sx={{ color: "#2563eb", fontSize: "18px !important" }} />}
                      onClick={() => setAiModalOpen(true)}
                      sx={{
                        borderColor: "#e5e7eb",
                        bgcolor: "#ffffff",
                        color: "#111827",
                        borderRadius: 9999,
                        px: { xs: 2.5, sm: 3 },
                        py: 1.2,
                        fontWeight: 800,
                        fontSize: "0.85rem",
                        textTransform: "none",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                        "&:hover": {
                          borderColor: "#111827",
                          bgcolor: "#f9fafb",
                          transform: "translateY(-2px)",
                          boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      AI Search
                    </Button>
                  </Box>

                  {/* AI Quick Search Prompt Bar */}
                  <Box
                    onClick={() => setAiModalOpen(true)}
                    sx={{
                      p: "6px 8px 6px 14px",
                      borderRadius: 9999,
                      bgcolor: "rgba(255, 255, 255, 0.9)",
                      border: "1.5px solid #e5e7eb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.03)",
                      cursor: "pointer",
                      backdropFilter: "blur(8px)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: "#111827",
                        bgcolor: "#ffffff",
                        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.07)",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, overflow: "hidden" }}>
                      <AutoAwesomeIcon sx={{ fontSize: 16, color: "#2563eb", flexShrink: 0 }} />
                      <Typography
                        sx={{
                          color: "#6b7280",
                          fontSize: { xs: "0.78rem", sm: "0.82rem" },
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        "Looking for comfortable black sneakers..."
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        bgcolor: "#111827",
                        color: "#ffffff",
                        borderRadius: 9999,
                        px: 1.6,
                        py: 0.5,
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        flexShrink: 0,
                      }}
                    >
                      AI Search <ArrowForwardIcon sx={{ fontSize: 11 }} />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>


            {/* Center Column: 100% Transparent 3D Floating Shoe */}
            <Grid size={{ xs: 12, md: 4.8 }}>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: { xs: 220, sm: 280, md: 340 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {heroSlides.map((slide, idx) => (
                  <Box
                    key={idx}
                    component="img"
                    src={slide.image}
                    alt={slide.title}
                    onError={(e: any) => {
                      e.target.src = "/img/kixora/hero_shoe1.png";
                    }}
                    sx={{
                      position: "absolute",
                      maxWidth: "100%",
                      maxHeight: "100%",
                      width: "auto",
                      height: "auto",
                      objectFit: "contain",
                      opacity: idx === activeSlide ? 1 : 0,
                      transform:
                        idx === activeSlide
                          ? "scale(1.06) translateY(-4px)"
                          : "scale(0.96) translateY(4px)",
                      transition:
                        "opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                      willChange: "opacity, transform",
                      filter: "drop-shadow(0 18px 24px rgba(0, 0, 0, 0.18))",
                      pointerEvents: idx === activeSlide ? "auto" : "none",
                      cursor: "pointer",
                      "&:hover": { transform: "scale(1.1) translateY(-8px)" },
                    }}
                    onClick={() => navigate("/products")}
                  />
                ))}
              </Box>
            </Grid>

            {/* Right Column: Triple Feature Badges */}
            <Grid size={{ xs: 12, md: 2.7 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "row", md: "column" },
                  justifyContent: { xs: "space-between", md: "center" },
                  gap: { xs: 2, md: 2.5 },
                  bgcolor: { xs: "rgba(255,255,255,0.6)", md: "transparent" },
                  p: { xs: 1.5, md: 0 },
                  borderRadius: 3,
                }}
              >
                {featureBadges.map((badge, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.4,
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        bgcolor: "#ffffff",
                        border: "1px solid #e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                      }}
                    >
                      {badge.icon}
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 900,
                          color: "#111827",
                          fontSize: "0.75rem",
                          letterSpacing: "0.06em",
                          display: "block",
                          lineHeight: 1.2,
                        }}
                      >
                        {badge.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#6b7280",
                          fontSize: "0.7rem",
                          lineHeight: 1.2,
                          display: "block",
                        }}
                      >
                        {badge.desc}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>

          {/* Bottom Left Controls: Dots + Arrows */}
          <Box
            sx={{
              position: "absolute",
              bottom: { xs: 12, md: 16 },
              left: { xs: 16, md: 32 },
              display: "flex",
              alignItems: "center",
              gap: 1.8,
              zIndex: 2,
            }}
          >
            {/* Dots */}
            <Box sx={{ display: "flex", gap: 0.7 }}>
              {heroSlides.map((_, idx) => (
                <Box
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  sx={{
                    width: idx === activeSlide ? 16 : 6,
                    height: 6,
                    borderRadius: 9999,
                    bgcolor: idx === activeSlide ? "#111827" : "#d1d5db",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </Box>

            {/* Circular Arrows */}
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <IconButton
                size="small"
                onClick={handlePrev}
                sx={{
                  color: "#111827",
                  border: "1px solid #d1d5db",
                  bgcolor: "#ffffff",
                  p: 0.5,
                  "&:hover": { bgcolor: "#f3f4f6" },
                }}
              >
                <ArrowBackIosNewIcon sx={{ fontSize: 9 }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={handleNext}
                sx={{
                  color: "#111827",
                  border: "1px solid #d1d5db",
                  bgcolor: "#ffffff",
                  p: 0.5,
                  "&:hover": { bgcolor: "#f3f4f6" },
                }}
              >
                <ArrowForwardIosIcon sx={{ fontSize: 9 }} />
              </IconButton>
            </Box>
          </Box>

          {/* Bottom Right Slide Numbering */}
          <Box
            sx={{
              position: "absolute",
              bottom: { xs: 14, md: 18 },
              right: { xs: 16, md: 32 },
              zIndex: 2,
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: "#6b7280", fontWeight: 800, letterSpacing: 1.5, fontSize: "0.8rem" }}
            >
              0{activeSlide + 1} / 0{heroSlides.length}
            </Typography>
          </Box>
        </Box>
      </Container>

      {/* KIXORA AI Semantic Footwear Search Dialog */}
      <AISearchDialog
        open={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onAddToCart={onAdd}
      />
    </Box>
  );
}

