import { Box, Container, Typography, Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";

export function NewArrivalsBanner() {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 6, bgcolor: "#ffffff" }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            bgcolor: "#000000",
            color: "#ffffff",
            borderRadius: { xs: 4, md: 5 },
            p: { xs: 4, sm: 6, md: 7 },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            gap: 3,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle Ambient glow */}
          <Box
            sx={{
              position: "absolute",
              top: "-50%",
              right: "-20%",
              width: "50%",
              height: "200%",
              background: "radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)",
              filter: "blur(40px)",
              pointerEvents: "none",
            }}
          />

          <Box sx={{ maxWidth: 540, position: "relative", zIndex: 1 }}>
            <Typography
              variant="caption"
              sx={{
                color: "#9ca3af",
                fontWeight: 800,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontSize: "0.75rem",
              }}
            >
              LIMITED EDITION DROPS
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                fontSize: { xs: "1.8rem", sm: "2.4rem", md: "2.8rem" },
                letterSpacing: "-0.03em",
                mt: 0.5,
                mb: 1.5,
                lineHeight: 1.1,
              }}
            >
              The latest drops. <br />
              Be the first.
            </Typography>
            <Typography variant="body1" sx={{ color: "#9ca3af", fontSize: "1rem" }}>
              Engineered with aerodynamic carbon plates and cloud-soft foam for maximum rebound and effortless street style.
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate("/products")}
            sx={{
              bgcolor: "#ffffff",
              color: "#000000",
              borderRadius: 9999,
              px: 4,
              py: 1.5,
              fontWeight: 800,
              fontSize: "0.95rem",
              textTransform: "none",
              boxShadow: "0 10px 25px rgba(255,255,255,0.12)",
              flexShrink: 0,
              position: "relative",
              zIndex: 1,
              "&:hover": {
                bgcolor: "#f3f4f6",
                transform: "translateY(-2px)",
              },
              transition: "all 0.2s ease",
            }}
          >
            Shop New Arrivals
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
