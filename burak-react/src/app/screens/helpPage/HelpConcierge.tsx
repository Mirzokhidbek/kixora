import { Box, Typography, Grid, Card, CardContent, Button } from "@mui/material";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import PhoneCallbackIcon from "@mui/icons-material/PhoneCallback";
import TelegramIcon from "@mui/icons-material/Telegram";

export function HelpConcierge() {
  return (
    <Box sx={{ mb: 6 }}>
      {/* Concierge Banner */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "#fff",
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          mb: 5,
          textAlign: "center",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <Typography variant="overline" sx={{ color: "primary.main", fontWeight: 800, letterSpacing: 2 }}>
          BURAK GUEST CONCIERGE
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 800, my: 1.5, fontSize: { xs: "2rem", md: "2.8rem" } }}>
          How May We Assist You Today?
        </Typography>
        <Typography variant="body1" sx={{ color: "#94a3b8", maxWidth: 600, mx: "auto" }}>
          Find immediate answers regarding orders, table bookings, menu inquiries, or connect with our customer care specialists.
        </Typography>
      </Box>

      {/* Quick Contact Action Cards */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3, borderRadius: 3, textAlign: "center", border: "1px solid #e2e8f0" }}>
            <CardContent>
              <HeadsetMicIcon sx={{ fontSize: 44, color: "primary.main", mb: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                24/7 Live Concierge
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Chat directly with our support team for instant order adjustments.
              </Typography>
              <Button variant="outlined" color="primary" sx={{ borderRadius: 2 }}>
                Start Live Chat
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3, borderRadius: 3, textAlign: "center", border: "1px solid #e2e8f0" }}>
            <CardContent>
              <PhoneCallbackIcon sx={{ fontSize: 44, color: "primary.main", mb: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                VIP Phone Hotline
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Direct line for table reservations and bespoke banquet arrangements.
              </Typography>
              <Button variant="outlined" color="primary" href="tel:+998712004567" sx={{ borderRadius: 2 }}>
                +998 71 200 45 67
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3, borderRadius: 3, textAlign: "center", border: "1px solid #e2e8f0" }}>
            <CardContent>
              <TelegramIcon sx={{ fontSize: 44, color: "primary.main", mb: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Telegram Bot Support
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Receive live SMS / push updates on delivery rider location.
              </Typography>
              <Button variant="outlined" color="primary" href="https://t.me" target="_blank" sx={{ borderRadius: 2 }}>
                Open @BurakSupportBot
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
