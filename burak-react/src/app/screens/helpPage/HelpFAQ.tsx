import { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";

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

export function HelpFAQ() {
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
    <Box sx={{ mb: 6 }}>
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", alignItems: { xs: "stretch", md: "center" }, gap: 2, mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Frequently Asked Questions
        </Typography>

        <TextField
          size="small"
          placeholder="Search FAQs..."
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
          sx={{ minWidth: 260, bgcolor: "#fff", borderRadius: 2 }}
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
  );
}
