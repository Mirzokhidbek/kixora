import { Container, Box } from "@mui/material";
import { MemberInfo } from "./MemberInfo";
import { MemberSettings } from "./MemberSettings";
import type { Member } from "../../../lib/types/member";

interface UserPageProps {
  member?: Member | null;
}

export function UserPage({ member }: UserPageProps) {
  return (
    <Box sx={{ py: 6, minHeight: "85vh" }}>
      <Container maxWidth="lg">
        {/* 1. Member Profile & Metrics */}
        <MemberInfo member={member} />

        {/* 2. Member Settings & Addresses */}
        <MemberSettings member={member} />
      </Container>
    </Box>
  );
}
