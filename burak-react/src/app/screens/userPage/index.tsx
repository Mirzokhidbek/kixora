import { Container, Box, Card, Typography, Button } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { MemberInfo } from "./MemberInfo";
import { MemberSettings } from "./MemberSettings";
import type { Member } from "../../../lib/types/member";
import { useGlobals } from "../../context/ContextProvider";

interface UserPageProps {
  member?: Member | null;
}

export function UserPage({ member: propMember }: UserPageProps) {
  const { authMember } = useGlobals();
  const member = propMember || authMember;

  if (!member) {
    return (
      <Box sx={{ py: 10, minHeight: "85vh", display: "flex", alignItems: "center" }}>
        <Container maxWidth="sm">
          <Card
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 4,
              bgcolor: "#0f172a",
              color: "#fff",
              border: "1px solid rgba(245, 158, 11, 0.3)",
              boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 60, color: "#f59e0b", mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
              VIP Profile Access
            </Typography>
            <Typography variant="body1" sx={{ color: "#94a3b8", mb: 4, lineHeight: 1.7 }}>
              Please sign in to access your personal credentials, loyalty tier rewards, saved delivery addresses, and culinary preferences.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => (window.location.href = "/")}
              sx={{ borderRadius: 3, px: 5, py: 1.3, fontWeight: 800, fontSize: "1rem" }}
            >
              Sign In to Your Account
            </Button>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 6, minHeight: "85vh", bgcolor: "#f8fafc" }}>
      <Container maxWidth="lg">
        {/* 1. Member Profile Hero & Metrics */}
        <MemberInfo member={member} />

        {/* 2. Member Settings, Addresses & Preferences */}
        <MemberSettings member={member} />
      </Container>
    </Box>
  );
}
