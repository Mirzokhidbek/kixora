import { Box, Typography, Grid, Card, CardContent, Button } from "@mui/material";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import PhoneCallbackOutlinedIcon from "@mui/icons-material/PhoneCallbackOutlined";
import TelegramIcon from "@mui/icons-material/Telegram";

export function HelpConcierge() {
  return (
    <Box sx={{ mb: 6 }}>
      {/* Concierge Banner */}
      <Box
        sx={{
          bgcolor: "#000000",
          color: "#ffffff",
          p: { xs: 4, md: 6 },
          borderRadius: 4,
          mb: 5,
          textAlign: "center",
          border: "1px solid #1f2937",
        }}
      >
        <Typography variant="overline" sx={{ color: "#9ca3af", fontWeight: 800, letterSpacing: 2 }}>
          KIXORA CLIENT CARE & SUPPORT
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 900, my: 1.5, fontSize: { xs: "2rem", md: "2.6rem" }, letterSpacing: "-0.03em" }}>
          How May We Assist You Today?
        </Typography>
        <Typography variant="body1" sx={{ color: "#9ca3af", maxWidth: 600, mx: "auto" }}>
          Find answers regarding shoe sizing, limited edition drop dates, express order tracking, and 30-day returns.
        </Typography>
      </Box>

      {/* Quick Contact Action Cards */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3, borderRadius: 3.5, textAlign: "center", border: "1px solid #e5e7eb", boxShadow: "none" }}>
            <CardContent>
              <HeadsetMicOutlinedIcon sx={{ fontSize: 40, color: "#000000", mb: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#111827" }}>
                24/7 Live Support
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, fontSize: "0.85rem" }}>
                Chat directly with our footwear specialists for instant size and order help.
              </Typography>
              <Button
                variant="outlined"
                sx={{
                  borderRadius: 9999,
                  borderColor: "#000000",
                  color: "#000000",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  textTransform: "none",
                  "&:hover": { bgcolor: "#000000", color: "#ffffff", borderColor: "#000000" },
                }}
              >
                Start Live Chat
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3, borderRadius: 3.5, textAlign: "center", border: "1px solid #e5e7eb", boxShadow: "none" }}>
            <CardContent>
              <PhoneCallbackOutlinedIcon sx={{ fontSize: 40, color: "#000000", mb: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#111827" }}>
                VIP Hotline
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, fontSize: "0.85rem" }}>
                Direct phone line for limited drops, bulk corporate orders, and styling advice.
              </Typography>
              <Button
                variant="outlined"
                href="tel:+998712008899"
                sx={{
                  borderRadius: 9999,
                  borderColor: "#000000",
                  color: "#000000",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  textTransform: "none",
                  "&:hover": { bgcolor: "#000000", color: "#ffffff", borderColor: "#000000" },
                }}
              >
                +998 71 200 88 99
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3, borderRadius: 3.5, textAlign: "center", border: "1px solid #e5e7eb", boxShadow: "none" }}>
            <CardContent>
              <TelegramIcon sx={{ fontSize: 40, color: "#000000", mb: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#111827" }}>
                Telegram Bot Support
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, fontSize: "0.85rem" }}>
                Receive real-time drop notifications and instant courier live tracking.
              </Typography>
              <Button
                variant="outlined"
                href="https://t.me"
                target="_blank"
                sx={{
                  borderRadius: 9999,
                  borderColor: "#000000",
                  color: "#000000",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  textTransform: "none",
                  "&:hover": { bgcolor: "#000000", color: "#ffffff", borderColor: "#000000" },
                }}
              >
                Open @KixoraSupportBot
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
