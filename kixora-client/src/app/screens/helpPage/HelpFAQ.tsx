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
import { STORE_INFO } from "../../../lib/storeInfo";

const FAQ_ITEMS = [
  {
    category: "SIZING",
    q: "How do I choose the correct shoe size for KIXORA sneakers?",
    a: "All KIXORA footwear fits true to European standard sizing (EU 38-45). If you have wide feet or are between half sizes, we recommend selecting one half size up for maximum athletic comfort.",
  },
  {
    category: "SHIPPING",
    q: "How long does express shipping take and is it free?",
    a: "We offer complimentary express delivery across Uzbekistan on all orders over $100. Standard delivery arrives within 24 to 48 hours with door-to-door real-time tracking.",
  },
  {
    category: "AUTHENTICITY",
    q: "Are KIXORA shoes original?",
    a: "We sell original products only. If you have any doubt about an item, write to us from the Help page before or after your purchase and we will help.",
  },
  {
    category: "RETURNS",
    q: "What is the return and exchange policy?",
    a: `We offer a ${STORE_INFO.returnDays}-day return and size exchange policy. Shoes must be unworn in their original packaging with tags intact.`,
  },
  {
    category: "DROPS",
    q: "How do I hear about limited drops?",
    a: "Subscribe to the newsletter at the bottom of the page. Subscribers are the first to hear about new and limited releases.",
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
        <Typography variant="h4" sx={{ fontWeight: 900, color: "#000000", letterSpacing: "-0.02em" }}>
          Frequently Asked Questions
        </Typography>

        <TextField
          size="small"
          placeholder="Search question..."
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
          sx={{
            minWidth: 260,
            "& .MuiOutlinedInput-root": {
              borderRadius: 9999,
              bgcolor: "#f9fafb",
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: "#6b7280" }} />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* Category Tabs */}
      <Tabs
        value={selectedCat}
        onChange={(_, val) => setSelectedCat(val)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 3,
          "& .MuiTab-root": {
            fontWeight: 800,
            fontSize: "0.85rem",
            textTransform: "none",
            color: "#6b7280",
            "&.Mui-selected": { color: "#000000" },
          },
          "& .MuiTabs-indicator": { bgcolor: "#000000", height: 2 },
        }}
      >
        <Tab label="All Inquiries" value="ALL" />
        <Tab label="Size & Fit" value="SIZING" />
        <Tab label="Express Shipping" value="SHIPPING" />
        <Tab label="Authenticity" value="AUTHENTICITY" />
        <Tab label="Returns & Exchanges" value="RETURNS" />
        <Tab label="Limited Drops" value="DROPS" />
      </Tabs>

      {/* FAQ Accordions */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {filteredFaqs.map((faq, idx) => (
          <Accordion
            key={idx}
            elevation={0}
            sx={{
              borderRadius: "16px !important",
              border: "1px solid #e5e7eb",
              "&:before": { display: "none" },
              bgcolor: "#ffffff",
              overflow: "hidden",
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#000000" }} />}>
              <Typography sx={{ fontWeight: 800, fontSize: "0.95rem", color: "#111827" }}>
                {faq.q}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0, pb: 2.5 }}>
              <Typography sx={{ color: "#4b5563", lineHeight: 1.7, fontSize: "0.9rem" }}>
                {faq.a}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
}
