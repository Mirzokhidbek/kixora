/**
 * Page opened from the password-reset email link.
 */
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Alert, Box, Button, CircularProgress, Container, TextField, Typography } from "@mui/material";
import MemberService from "../services/MemberService";
import { useGlobals } from "../hooks/useGlobals";

const memberService = new MemberService();

export function ResetPasswordPage({ onLoginClick }: { onLoginClick: () => void }) {
  const [params] = useSearchParams();
  const { setAuthMember } = useGlobals();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [state, setState] = useState<"form" | "saving" | "done">("form");
  const [error, setError] = useState("");

  const handleSave = async () => {
    setError("");
    if (password.length < 6) return setError("Password must be at least 6 characters long.");
    if (password !== confirm) return setError("Passwords do not match.");
    setState("saving");
    try {
      await memberService.resetPassword(token, password);
      setAuthMember(null); // all sessions were signed out
      setState("done");
    } catch (err: any) {
      setError(err?.response?.data?.message || "This link is invalid or has expired.");
      setState("form");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 10 }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
        Choose a new password
      </Typography>
      {state === "done" ? (
        <Box>
          <Alert severity="success" sx={{ mb: 2 }}>
            Your password was changed. Please sign in with the new password.
          </Alert>
          <Button variant="contained" onClick={onLoginClick} sx={{ bgcolor: "#111827" }}>
            Sign in
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {!token && <Alert severity="error">This link is incomplete. Please use the link from the email.</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          <TextField type="password" label="New password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
          <TextField type="password" label="Repeat new password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
          <Button variant="contained" disabled={!token || state === "saving"} onClick={handleSave} sx={{ bgcolor: "#111827", py: 1.2 }}>
            {state === "saving" ? <CircularProgress size={20} color="inherit" /> : "Save new password"}
          </Button>
        </Box>
      )}
    </Container>
  );
}
