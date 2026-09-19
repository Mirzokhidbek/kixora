import { Container, Box } from "@mui/material";
import { MemberInfo } from "./MemberInfo";
import { MemberSettings } from "./MemberSettings";

export function UserPage() {
  return (
    <Box sx={{ py: 6, minHeight: "85vh" }}>
      <Container maxWidth="lg">
        {/* 1. Member Profile & Metrics */}
        <MemberInfo />

        {/* 2. Member Settings & Addresses */}
        <MemberSettings />
      </Container>
    </Box>
  );
}
