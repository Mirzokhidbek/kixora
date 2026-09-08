import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  IconButton,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TelegramIcon from "@mui/icons-material/Telegram";
import FacebookIcon from "@mui/icons-material/Facebook";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";

export function Footer() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const handleSubscribe = () => {
    if (!email || !email.includes("@")) {
      setToastMsg("Please enter a valid email address.");
      setToastOpen(true);
      return;
    }
    setToastMsg("Welcome to KIXORA VIP Club! You will receive early drop notifications.");
    setToastOpen(true);
    setEmail("");
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#000000",
        color: "#9ca3af",
        pt: 9,
        pb: 5,
        mt: "auto",
        borderTop: "1px solid #1f2937",
        position: "relative",
      }}
    >
      <Container maxWidth="lg">
        {/* Newsletter Section */}
        <Box
          sx={{
            pb: 7,
            mb: 7,
            borderBottom: "1px solid #1f2937",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            gap: 3,
          }}
        >
          <Box sx={{ maxWidth: 460 }}>
            <Typography variant="h5" sx={{ fontWeight: 900, color: "#ffffff", mb: 0.5, letterSpacing: "-0.02em" }}>
              Join the KIXORA Club
            </Typography>
            <Typography variant="body2" sx={{ color: "#9ca3af" }}>
              Be the first to hear about new drops, exclusive collaborations, and VIP member events.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1, width: { xs: "100%", sm: "auto" } }}>
            <TextField
              size="small"
              placeholder="Enter your email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                bgcolor: "#111827",
                borderRadius: 9999,
                minWidth: { xs: "100%", sm: 280 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 9999,
                  border: "1px solid #374151",
                  color: "#ffffff",
                },
                "& input": { color: "#ffffff", fontSize: "0.88rem", px: 2.5 },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSubscribe}
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: "#ffffff",
                color: "#000000",
                borderRadius: 9999,
                px: 3,
                fontWeight: 800,
                fontSize: "0.88rem",
                textTransform: "none",
                flexShrink: 0,
                "&:hover": { bgcolor: "#f3f4f6" },
              }}
            >
              Subscribe
            </Button>
          </Box>
        </Box>

        {/* Links Grid */}
        <Grid container spacing={5} sx={{ mb: 7 }}>
          {/* Col 1: Brand & Bio */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              onClick={() => navigate("/")}
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2, cursor: "pointer" }}
            >
              <Box
                component="img"
                src="/img/kixora/logo.png"
                alt="KIXORA"
                sx={{
                  height: 40,
                  width: "auto",
                  objectFit: "contain",
                  bgcolor: "#ffffff",
                  p: 0.6,
                  borderRadius: 2,
                }}
              />
            </Box>

            <Typography variant="body2" sx={{ lineHeight: 1.8, mb: 3, maxWidth: 320, color: "#9ca3af" }}>
              High-performance and luxury lifestyle footwear designed for creators, athletes, and modern tastemakers worldwide.
            </Typography>

            {/* Social Icons */}
            <Box sx={{ display: "flex", gap: 1 }}>
              {[
                { icon: <InstagramIcon fontSize="small" />, url: "https://instagram.com" },
                { icon: <TelegramIcon fontSize="small" />, url: "https://t.me" },
                { icon: <YouTubeIcon fontSize="small" />, url: "https://youtube.com" },
                { icon: <FacebookIcon fontSize="small" />, url: "https://facebook.com" },
              ].map((s, idx) => (
                <IconButton
                  key={idx}
                  href={s.url}
                  target="_blank"
                  sx={{
                    color: "#9ca3af",
                    bgcolor: "#111827",
                    border: "1px solid #1f2937",
                    p: 1,
                    "&:hover": {
                      color: "#ffffff",
                      bgcolor: "#1f2937",
                    },
                    transition: "all 0.2s",
                  }}
                >
                  {s.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Col 2: Shop */}
          <Grid size={{ xs: 6, sm: 4, md: 2.5 }}>
            <Typography variant="subtitle2" sx={{ color: "#ffffff", fontWeight: 800, mb: 2.5, letterSpacing: "0.05em" }}>
              SHOP DROPS
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
              <Link onClick={() => navigate("/products")} sx={{ cursor: "pointer", "&:hover": { color: "#ffffff" } }} color="inherit" underline="none">
                All Sneakers
              </Link>
              <Link onClick={() => navigate("/products")} sx={{ cursor: "pointer", "&:hover": { color: "#ffffff" } }} color="inherit" underline="none">
                Running & Athletic
              </Link>
              <Link onClick={() => navigate("/products")} sx={{ cursor: "pointer", "&:hover": { color: "#ffffff" } }} color="inherit" underline="none">
                High-Top Boots
              </Link>
              <Link onClick={() => navigate("/products")} sx={{ cursor: "pointer", "&:hover": { color: "#ffffff" } }} color="inherit" underline="none">
                Casual Streetwear
              </Link>
              <Link onClick={() => navigate("/products")} sx={{ cursor: "pointer", "&:hover": { color: "#ffffff" } }} color="inherit" underline="none">
                Limited Drops
              </Link>
            </Box>
          </Grid>

          {/* Col 3: Support */}
          <Grid size={{ xs: 6, sm: 4, md: 2.5 }}>
            <Typography variant="subtitle2" sx={{ color: "#ffffff", fontWeight: 800, mb: 2.5, letterSpacing: "0.05em" }}>
              CUSTOMER CARE
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
              <Link onClick={() => navigate("/orders")} sx={{ cursor: "pointer", "&:hover": { color: "#ffffff" } }} color="inherit" underline="none">
                Order Tracking
              </Link>
              <Link onClick={() => navigate("/help")} sx={{ cursor: "pointer", "&:hover": { color: "#ffffff" } }} color="inherit" underline="none">
                Shipping & Returns
              </Link>
              <Link onClick={() => navigate("/help")} sx={{ cursor: "pointer", "&:hover": { color: "#ffffff" } }} color="inherit" underline="none">
                Shoe Size Guide
              </Link>
              <Link onClick={() => navigate("/help")} sx={{ cursor: "pointer", "&:hover": { color: "#ffffff" } }} color="inherit" underline="none">
                Product Care
              </Link>
              <Link onClick={() => navigate("/help")} sx={{ cursor: "pointer", "&:hover": { color: "#ffffff" } }} color="inherit" underline="none">
                Contact Us
              </Link>
            </Box>
          </Grid>

          {/* Col 4: About */}
          <Grid size={{ xs: 12, sm: 4, md: 3 }}>
            <Typography variant="subtitle2" sx={{ color: "#ffffff", fontWeight: 800, mb: 2.5, letterSpacing: "0.05em" }}>
              HEADQUARTERS
            </Typography>
            <Typography variant="body2" sx={{ color: "#9ca3af", mb: 1.5, lineHeight: 1.6 }}>
              KIXORA Flagship Store & Concept Lab <br />
              Tashkent, Uzbekistan
            </Typography>
            <Typography variant="body2" sx={{ color: "#ffffff", fontWeight: 700 }}>
              support@kixora.com
            </Typography>
            <Typography variant="body2" sx={{ color: "#9ca3af" }}>
              +998 71 200 88 99
            </Typography>
          </Grid>
        </Grid>

        {/* Bottom Legal Bar */}
        <Box
          sx={{
            pt: 4,
            borderTop: "1px solid #1f2937",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="caption" sx={{ color: "#6b7280" }}>
            &copy; {new Date().getFullYear()} KIXORA Footwear Group. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            <Link onClick={() => navigate("/help")} sx={{ cursor: "pointer", color: "#6b7280", "&:hover": { color: "#ffffff" } }} underline="none" variant="caption">
              Privacy Policy
            </Link>
            <Link onClick={() => navigate("/help")} sx={{ cursor: "pointer", color: "#6b7280", "&:hover": { color: "#ffffff" } }} underline="none" variant="caption">
              Terms of Service
            </Link>
            <Link onClick={() => navigate("/help")} sx={{ cursor: "pointer", color: "#6b7280", "&:hover": { color: "#ffffff" } }} underline="none" variant="caption">
              Cookie Preferences
            </Link>
          </Box>
        </Box>

        <Snackbar
          open={toastOpen}
          autoHideDuration={3500}
          onClose={() => setToastOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity="success" sx={{ width: "100%", borderRadius: 2, fontWeight: 700 }}>
            {toastMsg}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
