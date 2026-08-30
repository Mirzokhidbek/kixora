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
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SendIcon from "@mui/icons-material/Send";
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
    setToastMsg("Thank you for joining Burakfood VIP Club!");
    setToastOpen(true);
    setEmail("");
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#090d16",
        color: "#94a3b8",
        pt: 8,
        pb: 4,
        mt: "auto",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        position: "relative",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5} sx={{ mb: 6 }}>
          {/* Col 1: Brand & Socials */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              onClick={() => navigate("/")}
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, cursor: "pointer" }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 900,
                  fontSize: "1.8rem",
                  color: "#f59e0b",
                  letterSpacing: "-0.03em",
                }}
              >
                Burak<span style={{ color: "#ffffff" }}>food</span>
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ lineHeight: 1.8, mb: 3, maxWidth: 340, color: "#94a3b8" }}>
              Indulge in authentic Turkish gastronomy. Savor oversized steaks, wood-fired kebabs, and Gaziantep pistachio baklavas crafted with love by Chef CZN Burak.
            </Typography>

            {/* Social Icons */}
            <Box sx={{ display: "flex", gap: 1 }}>
              {[
                { icon: <InstagramIcon />, url: "https://instagram.com" },
                { icon: <TelegramIcon />, url: "https://t.me" },
                { icon: <YouTubeIcon />, url: "https://youtube.com" },
                { icon: <FacebookIcon />, url: "https://facebook.com" },
              ].map((s, idx) => (
                <IconButton
                  key={idx}
                  href={s.url}
                  target="_blank"
                  sx={{
                    color: "#cbd5e1",
                    bgcolor: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    "&:hover": {
                      color: "#000",
                      bgcolor: "#f59e0b",
                      transform: "translateY(-3px)",
                    },
                    transition: "0.2s",
                  }}
                >
                  {s.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Col 2: Quick Links */}
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 800, mb: 2.5 }}>
              Explore Menu
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
              <Link onClick={() => navigate("/products")} sx={{ cursor: "pointer", "&:hover": { color: "#f59e0b" } }} color="inherit" underline="hover">
                Signature Steaks
              </Link>
              <Link onClick={() => navigate("/products")} sx={{ cursor: "pointer", "&:hover": { color: "#f59e0b" } }} color="inherit" underline="hover">
                Handcrafted Kebabs
              </Link>
              <Link onClick={() => navigate("/products")} sx={{ cursor: "pointer", "&:hover": { color: "#f59e0b" } }} color="inherit" underline="hover">
                Turkish Desserts
              </Link>
              <Link onClick={() => navigate("/products")} sx={{ cursor: "pointer", "&:hover": { color: "#f59e0b" } }} color="inherit" underline="hover">
                Samovar Beverages
              </Link>
              <Link onClick={() => navigate("/orders")} sx={{ cursor: "pointer", "&:hover": { color: "#f59e0b" } }} color="inherit" underline="hover">
                Track Orders
              </Link>
            </Box>
          </Grid>

          {/* Col 3: Contact Info */}
          <Grid size={{ xs: 6, sm: 3, md: 3 }}>
            <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 800, mb: 2.5 }}>
              Contact Us
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                <LocationOnIcon sx={{ color: "#f59e0b", fontSize: 20, mt: 0.2 }} />
                <Typography variant="body2">Amir Timur Avenue, Tashkent, Uzbekistan</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <PhoneIcon sx={{ color: "#f59e0b", fontSize: 20 }} />
                <Typography variant="body2">+998 71 200 45 67</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <AccessTimeIcon sx={{ color: "#f59e0b", fontSize: 20 }} />
                <Typography variant="body2">Mon - Sun: 10:00 - 23:30</Typography>
              </Box>
            </Box>
          </Grid>

          {/* Col 4: Newsletter */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 800, mb: 2.5 }}>
              Join Burakfood VIP Club
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: "#94a3b8" }}>
              Subscribe to receive exclusive chef specials, seasonal discounts, and secret menu invites.
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                size="small"
                placeholder="Your email address"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  bgcolor: "rgba(255,255,255,0.05)",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.15)" },
                  "& input": { color: "#fff", fontSize: "0.88rem" },
                }}
              />
              <Button
                variant="contained"
                sx={{ minWidth: 44, px: 2, borderRadius: 2, bgcolor: "#f59e0b", "&:hover": { bgcolor: "#d97706" } }}
                onClick={handleSubscribe}
              >
                <SendIcon fontSize="small" />
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Legal Bar */}
        <Box
          sx={{
            pt: 4,
            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="caption" sx={{ color: "#64748b" }}>
            &copy; {new Date().getFullYear()} Burakfood Culinary Group. All Rights Reserved.
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            <Link onClick={() => navigate("/help")} sx={{ cursor: "pointer", color: "#64748b" }} underline="hover" variant="caption">
              Privacy Policy
            </Link>
            <Link onClick={() => navigate("/help")} sx={{ cursor: "pointer", color: "#64748b" }} underline="hover" variant="caption">
              Terms of Service
            </Link>
            <Link onClick={() => navigate("/help")} sx={{ cursor: "pointer", color: "#64748b" }} underline="hover" variant="caption">
              FAQ & Support
            </Link>
          </Box>
        </Box>

        <Snackbar
          open={toastOpen}
          autoHideDuration={3500}
          onClose={() => setToastOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity="success" sx={{ width: "100%", borderRadius: 3, fontWeight: 700 }}>
            {toastMsg}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
