import { Container, Box, Card, Typography, Button } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { MemberInfo } from "./MemberInfo";
import { MemberSettings } from "./MemberSettings";
import type { Member } from "../../../lib/types/member";
import { useGlobals } from "../../hooks/useGlobals";

interface UserPageProps {
  member?: Member | null;
}

export function UserPage({ member: propMember }: UserPageProps) {
  const { authMember } = useGlobals();
  const member = propMember || authMember;

  if (!member) {
    return (
      <Box sx={{ py: 10, minHeight: "85vh", display: "flex", alignItems: "center", bgcolor: "#ffffff" }}>
        <Container maxWidth="sm">
          <Card
            sx={{
              p: { xs: 4, md: 6 },
              textAlign: "center",
              borderRadius: 5,
              bgcolor: "#ffffff",
              color: "#0f172a",
              border: "1px solid #f1f5f9",
              boxShadow: "0 15px 40px rgba(0,0,0,0.05)",
            }}
          >
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: 4,
                bgcolor: "#fffbeb",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2.5,
              }}
            >
              <LockOutlinedIcon sx={{ fontSize: 36, color: "#f59e0b" }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5 }}>
              Account Access Required
            </Typography>
            <Typography variant="body1" sx={{ color: "#64748b", mb: 4, lineHeight: 1.7 }}>
              Please sign in to access your personal credentials, loyalty tier rewards, saved delivery addresses, and culinary preferences.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => (window.location.href = "/")}
              sx={{
                borderRadius: 3,
                px: 5,
                py: 1.4,
                fontWeight: 800,
                fontSize: "1rem",
                bgcolor: "#eab308",
                color: "#fff",
                boxShadow: "0 8px 20px rgba(234, 179, 8, 0.4)",
                "&:hover": { bgcolor: "#ca8a04" },
              }}
            >
              Sign In to Your Account
            </Button>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 6, minHeight: "85vh", bgcolor: "#ffffff" }}>
      <Container maxWidth="lg">
        {/* 1. Member Profile Hero & Metrics */}
        <MemberInfo member={member} />

        {/* 2. Member Settings, Addresses & Preferences */}
        <MemberSettings member={member} />
      </Container>
    </Box>
  );
}
