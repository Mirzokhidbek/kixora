import { Container, Box } from "@mui/material";
import { HelpConcierge } from "./HelpConcierge";
import { HelpFAQ } from "./HelpFAQ";
import { HelpContact } from "./HelpContact";

export function HelpPage() {
  return (
    <Box sx={{ py: 6, minHeight: "85vh" }}>
      <Container maxWidth="lg">
        {/* 1. Support Hero & Quick Contact Channels */}
        <HelpConcierge />

        {/* 2. Categorized FAQs Accordion */}
        <HelpFAQ />

        {/* 3. Direct Message Inquiry Form */}
        <HelpContact />
      </Container>
    </Box>
  );
}
