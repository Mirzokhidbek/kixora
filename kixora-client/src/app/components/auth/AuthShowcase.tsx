import { Box, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

/** Left brand panel of the auth dialog (desktop only) */
export function AuthShowcase({ onExplore }: { onExplore: () => void }) {
  return (
    <Box
      sx={{
        display: { xs: "none", md: "flex" },
        width: "42%",
        position: "relative",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 3,
        bgcolor: "#050505",
        color: "#ffffff",
        overflow: "hidden",
      }}
    >
      {/* Background Studio Shot */}
      <Box
        component="img"
        src="/img/kixora/auth_bg.jpg"
        alt="KIXORA Sneaker Crafting"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          opacity: 0.85,
        }}
      />

      {/* Dark Cinematic Vignette */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)",
          zIndex: 1,
        }}
      />

      {/* Top Logo */}
      <Box sx={{ position: "relative", zIndex: 2 }}>
        <Box
          component="img"
          src="/img/kixora/logo.png"
          alt="KIXORA"
          sx={{
            height: 26,
            width: "auto",
            objectFit: "contain",
            filter: "brightness(0) invert(1)",
          }}
        />
      </Box>

      {/* Bottom Slogan & Explore Link */}
      <Box sx={{ position: "relative", zIndex: 2 }}>
        <Typography
          variant="h3"
          sx={{
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 900,
            fontSize: "1.45rem",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: "#ffffff",
            mb: 0.6,
          }}
        >
          Step Into <br /> More
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#9ca3af",
            lineHeight: 1.45,
            fontSize: "0.76rem",
            mb: 2,
            maxWidth: 220,
          }}
        >
          Premium shoes for every journey. Style. Comfort. Performance.
        </Typography>

        <Box
          onClick={onExplore}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            color: "#ffffff",
            fontWeight: 600,
            fontSize: "0.78rem",
            cursor: "pointer",
            transition: "opacity 0.2s ease",
            "&:hover": { opacity: 0.8 },
          }}
        >
          <span>&mdash; Explore Collection</span>
          <Box
            sx={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowForwardIcon sx={{ fontSize: 11 }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
