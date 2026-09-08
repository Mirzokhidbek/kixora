import { Container, Box, Card, Typography, Button } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { MemberInfo } from "./MemberInfo";
import { MemberSettings } from "./MemberSettings";
import type { Member } from "../../../lib/types/member";
import { useGlobals } from "../../hooks/useGlobals";

interface UserPageProps {
  member?: Member | null;
  onLoginClick?: () => void;
}

export function UserPage({ member: propMember, onLoginClick }: UserPageProps) {
  const { authMember } = useGlobals();
  const member = propMember || authMember;

  if (!member) {
    return (
      <Box sx={{ py: 12, minHeight: "80vh", display: "flex", alignItems: "center", bgcolor: "#ffffff" }}>
        <Container maxWidth="sm">
          <Card
            sx={{
              p: { xs: 4, md: 6 },
              textAlign: "center",
              borderRadius: 4,
              bgcolor: "#ffffff",
              color: "#111827",
              border: "1px solid #e5e7eb",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                bgcolor: "#f3f4f6",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2.5,
              }}
            >
              <LockOutlinedIcon sx={{ fontSize: 32, color: "#111827" }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, color: "#000000", letterSpacing: "-0.02em" }}>
              Member Sign In Required
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280", mb: 4, lineHeight: 1.6, maxWidth: 360, mx: "auto" }}>
              Sign in to manage your KIXORA Club profile, view drop order status, and track your VIP points.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={onLoginClick || (() => (window.location.href = "/"))}
              sx={{
                borderRadius: 9999,
                px: 4.5,
                py: 1.4,
                fontWeight: 800,
                fontSize: "0.95rem",
                bgcolor: "#000000",
                color: "#ffffff",
                textTransform: "none",
                boxShadow: "none",
                "&:hover": { bgcolor: "#262626", boxShadow: "0 6px 20px rgba(0,0,0,0.15)" },
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
        {/* Member Profile Hero & Metrics */}
        <MemberInfo member={member} />

        {/* Member Settings, Addresses & Preferences */}
        <MemberSettings member={member} />
      </Container>
    </Box>
  );
}
