import { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Tabs,
  Tab,
  InputAdornment,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import PhoneCallbackIcon from "@mui/icons-material/PhoneCallback";
import TelegramIcon from "@mui/icons-material/Telegram";
import SendIcon from "@mui/icons-material/Send";

const FAQ_ITEMS = [
  {
    category: "ORDERING",
    q: "How does Burak Restaurant ensure hot and fresh delivery?",
    a: "All our signature meats and grilled items are packed in premium temperature-insulated thermal boxes immediately from the wood-fired grill, preserving heat and aroma until doorstep arrival.",
  },
  {
    category: "ORDERING",
    q: "Can I customize the doneness of my steaks or request allergen modifications?",
    a: "Yes! While placing your order, you can specify cooking preferences (Medium Rare, Medium, Well Done) or note dietary allergies in the item special instructions field.",
  },
  {
    category: "RESERVATION",
    q: "How far in advance should I book a VIP table for special celebrations?",
    a: "For weekend dinner reservations or private dining rooms, we recommend booking at least 24 to 48 hours in advance via our concierge hotline.",
  },
  {
    category: "PAYMENT",
    q: "Which payment systems are accepted for online and in-store dining?",
    a: "We accept Visa, MasterCard, Mir, UzCard, Humo, Payme, Click, and Cash upon delivery.",
  },
  {
    category: "LOYALTY",
    q: "How are Burak VIP Reward points calculated and redeemed?",
    a: "Every $1 spent earns 10 loyalty points. Accumulated points can be used for complimentary chef desserts, appetizers, or exclusive dining discounts.",
  },
];

export function HelpPage() {
  const [selectedCat, setSelectedCat] = useState("ALL");
  const [searchWord, setSearchWord] = useState("");

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    const matchesCat = selectedCat === "ALL" || item.category === selectedCat;
    const matchesSearch =
      item.q.toLowerCase().includes(searchWord.toLowerCase()) ||
      item.a.toLowerCase().includes(searchWord.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <Box sx={{ py: 6, minHeight: "85vh" }}>
      <Container maxWidth="lg">
        {/* Support Hero Banner */}
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
          <Typography variant="body1" sx={{ color: "#94a3b8", maxWidth: 600, mx: "auto", mb: 3 }}>
            Find immediate answers regarding orders, table bookings, menu inquiries, or connect with our customer care specialists.
          </Typography>

          <TextField
            placeholder="Search FAQs (e.g. delivery time, payment, reservations)..."
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            sx={{
              maxWidth: 550,
              width: "100%",
              bgcolor: "#fff",
              borderRadius: 3,
              "& .MuiOutlinedInput-root": { borderRadius: 3 },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "primary.main" }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        {/* Quick Contact Action Cards */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ p: 3, borderRadius: 3, textAlign: "center" }}>
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
            <Card sx={{ p: 3, borderRadius: 3, textAlign: "center" }}>
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
            <Card sx={{ p: 3, borderRadius: 3, textAlign: "center" }}>
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

        {/* FAQs Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
            Frequently Asked Questions
          </Typography>

          <Tabs
            value={selectedCat}
            onChange={(_, val) => setSelectedCat(val)}
            sx={{
              mb: 3,
              "& .MuiTabs-indicator": { backgroundColor: "#f59e0b", height: 3 },
              "& .MuiTab-root": { fontWeight: 700, color: "#64748b", "&.Mui-selected": { color: "#0f172a" } },
            }}
          >
            <Tab label="ALL TOPICS" value="ALL" />
            <Tab label="ORDERING & MENU" value="ORDERING" />
            <Tab label="RESERVATIONS" value="RESERVATION" />
            <Tab label="PAYMENTS" value="PAYMENT" />
            <Tab label="LOYALTY POINTS" value="LOYALTY" />
          </Tabs>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {filteredFaqs.map((faq, idx) => (
              <Accordion
                key={idx}
                defaultExpanded={idx === 0}
                sx={{
                  borderRadius: "12px !important",
                  border: "1px solid #e2e8f0",
                  "&:before": { display: "none" },
                  boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "primary.main" }} />}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#0f172a" }}>
                    {faq.q}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {faq.a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>

        {/* Contact Message Form */}
        <Card sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, bgcolor: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
            Have a Specific Inquiry?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Send a direct message to our restaurant management and executive chef team.
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Your Name" size="small" sx={{ bgcolor: "#fff" }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Your Email / Phone" size="small" sx={{ bgcolor: "#fff" }} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth multiline rows={3} label="Your Message or Special Request" sx={{ bgcolor: "#fff" }} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button
                variant="contained"
                color="primary"
                endIcon={<SendIcon />}
                onClick={() => alert("Your message has been dispatched to Burak Guest Relations!")}
                sx={{ borderRadius: 2, px: 3, py: 1, fontWeight: 700 }}
              >
                Submit Inquiry
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </Box>
  );
}
