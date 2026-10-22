import { useState } from "react";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { AuthField } from "./AuthField";
import { authSubmitSx } from "./authStyles";
import MemberService from "../../services/MemberService";

/** Requests a password-reset link by email */
export function ForgotPasswordForm({ initialEmail, onBack }: { initialEmail: string; onBack: () => void }) {
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    setError("");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Please enter a valid email address.");
    setLoading(true);
    try {
      await new MemberService().forgotPassword(email.trim().toLowerCase());
      setSent(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <Stack spacing={1.4}>
        <Typography variant="body2" sx={{ color: "#374151", fontSize: "0.82rem" }}>
          If an account exists for <b>{email}</b>, we sent a link to reset the password. It is valid for 30 minutes.
        </Typography>
        <Button onClick={onBack} sx={{ ...authSubmitSx, bgcolor: "#f3f4f6", color: "#111827", "&:hover": { bgcolor: "#e5e7eb" } }}>
          Back to log in
        </Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={1.4}>
      <Typography variant="body2" sx={{ color: "#6b7280", fontSize: "0.78rem" }}>
        Enter your account email and we will send you a reset link.
      </Typography>
      <AuthField
        label="Email address"
        placeholder="you@example.com"
        value={email}
        onChange={setEmail}
        icon={<EmailOutlinedIcon sx={{ color: "#9ca3af", fontSize: 16 }} />}
        disabled={loading}
        autoFocus
        autoComplete="email"
      />
      {error && <Typography variant="caption" sx={{ color: "#dc2626" }}>{error}</Typography>}
      <Button fullWidth variant="contained" onClick={handleSend} disabled={loading} sx={authSubmitSx}>
        {loading ? <CircularProgress size={18} color="inherit" /> : "Send reset link"}
      </Button>
      <Button onClick={onBack} disabled={loading} sx={{ textTransform: "none", color: "#6b7280", fontSize: "0.78rem" }}>
        Back to log in
      </Button>
    </Stack>
  );
}
