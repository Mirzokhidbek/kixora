/**
 * AuthModal - login / signup dialog.
 * Layout pieces live in AuthShowcase, LoginForm, SignupForm, GoogleButton and PolicyDialog.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Dialog, DialogContent, Divider, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { signInWithGoogle } from "../../../lib/firebase";
import MemberService from "../../services/MemberService";
import type { Member, LoginInput, MemberInput } from "../../../lib/types/member";
import { AuthShowcase } from "./AuthShowcase";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { GoogleButton } from "./GoogleButton";
import { PolicyDialog, type PolicyType } from "./PolicyDialog";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (member: Member) => void;
}

const memberService = new MemberService();

export function AuthModal({ open, onClose, onSuccess }: AuthModalProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [forgotMode, setForgotMode] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");

  const [signupFullName, setSignupFullName] = useState<string>("");
  const [signupEmail, setSignupEmail] = useState<string>("");
  const [signupPassword, setSignupPassword] = useState<string>("");

  const [policyDialog, setPolicyDialog] = useState<PolicyType | null>(null);

  const resetState = () => {
    setErrorMsg("");
    setSuccessMsg("");
    setShowPassword(false);
  };

  const handleTabSwitch = (tab: "login" | "signup") => {
    setActiveTab(tab);
    setForgotMode(false);
    resetState();
  };

  const finishAuth = (member: Member, message: string) => {
    setSuccessMsg(message);
    setTimeout(() => {
      onSuccess(member);
      onClose();
      setLoading(false);
    }, 400);
  };

  /** Google sign-in: the Firebase-signed ID token is verified by the server */
  const handleGoogleLogin = async () => {
    resetState();
    setLoading(true);
    try {
      const { user } = await signInWithGoogle();
      if (!user.email) throw new Error("No email associated with this Google account.");
      const member = await memberService.googleLogin(await user.getIdToken());
      finishAuth(member, `Welcome back, ${member?.memberNick || user.displayName || "there"}! ✨`);
    } catch (err: any) {
      setLoading(false);
      if (err.code === "auth/popup-closed-by-user") return;
      setErrorMsg(err.response?.data?.message || err.message || "Google sign in error. Please try again.");
    }
  };

  const handleLogin = async () => {
    resetState();
    const identifier = loginEmail.trim();
    if (!identifier) return setErrorMsg("Please enter your email address.");
    if (!loginPassword) return setErrorMsg("Please enter your password.");

    setLoading(true);
    try {
      const input: LoginInput = { memberEmail: identifier, memberNick: identifier, memberPassword: loginPassword };
      const member = await memberService.login(input);
      finishAuth(member, `Welcome back, ${member?.memberNick || identifier.split("@")[0]}!`);
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.response?.data?.message || "Incorrect email or password. Please try again.");
    }
  };

  const handleSignup = async () => {
    resetState();
    const name = signupFullName.trim();
    const email = signupEmail.trim().toLowerCase();
    if (!name) return setErrorMsg("Please enter your full name.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErrorMsg("Please enter a valid email address.");
    if (signupPassword.length < 6) return setErrorMsg("Password must be at least 6 characters long.");

    setLoading(true);
    try {
      // No phone is sent: it is optional and added later in the profile
      // (previously every email signup got the same fake "+998901234567")
      const input: MemberInput = { memberNick: name, memberEmail: email, memberPassword: signupPassword };
      const member = await memberService.signup(input);
      finishAuth(member, `Account created! Welcome, ${member?.memberNick || name}!`);
    } catch (err: any) {
      setLoading(false);
      if (err.response?.status === 409) {
        // only a real duplicate (HTTP 409) means "already registered"
        setErrorMsg(err.response.data?.message || "This account is already registered. Please sign in instead.");
        setLoginEmail(email);
      } else {
        setErrorMsg(err.response?.data?.message || "Registration failed. Please check your details and try again.");
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Enter" || loading || forgotMode) return;
    if (activeTab === "login") handleLogin();
    else handleSignup();
  };

  const handleExplore = () => {
    onClose();
    navigate("/products");
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: "16px",
            bgcolor: "#ffffff",
            color: "#111827",
            overflow: "hidden",
            boxShadow: "0 25px 70px rgba(0, 0, 0, 0.3)",
            maxWidth: 720,
            m: { xs: 1.5, sm: 2 },
          },
        },
      }}
    >
      <DialogContent sx={{ p: 0, overflow: "hidden" }} onKeyDown={handleKeyDown}>
        <Box sx={{ display: "flex", minHeight: { xs: "auto", md: 470 } }}>
          <AuthShowcase onExplore={handleExplore} />

          <Box
            sx={{
              width: { xs: "100%", md: "58%" },
              p: { xs: 2.5, sm: 3 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              bgcolor: "#ffffff",
              position: "relative",
            }}
          >
            {/* Top Switcher & Close Icon */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 1.5,
                mb: 1.5,
              }}
            >
              <Typography variant="body2" sx={{ color: "#6b7280", fontSize: "0.78rem" }}>
                {activeTab === "login" ? "Don't have an account? " : "Already have an account? "}
                <Typography
                  component="span"
                  sx={{
                    color: "#a67c52",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    "&:hover": { textDecoration: "underline" },
                  }}
                  onClick={() => handleTabSwitch(activeTab === "login" ? "signup" : "login")}
                >
                  {activeTab === "login" ? "Sign Up" : "Log In"}
                </Typography>
              </Typography>

              <IconButton
                onClick={onClose}
                disabled={loading}
                size="small"
                sx={{
                  color: "#9ca3af",
                  p: 0.5,
                  "&:hover": { color: "#000000", bgcolor: "#f3f4f6" },
                }}
              >
                <CloseIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>

            {/* Form Inner Content */}
            <Box sx={{ maxWidth: 310, width: "100%", mx: "auto" }}>
              {/* Heading */}
              <Box sx={{ mb: 1.8 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 800,
                    color: "#111827",
                    fontSize: "1.35rem",
                    letterSpacing: "-0.02em",
                    mb: 0.3,
                  }}
                >
                  {activeTab === "login" ? "Welcome Back" : "Create Account"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#6b7280", fontSize: "0.78rem", lineHeight: 1.4 }}
                >
                  {activeTab === "login"
                    ? "Log in to your Kixora account"
                    : "Join Kixora and get exclusive offers and new arrivals."}
                </Typography>
              </Box>

              {/* Status Notifications */}
              {errorMsg && (
                <Alert
                  severity={errorMsg.includes("registered") ? "info" : "error"}
                  sx={{ mb: 1.5, py: 0.2, px: 1.2, borderRadius: "8px", fontSize: "0.76rem", fontWeight: 600 }}
                >
                  {errorMsg}
                </Alert>
              )}

              {successMsg && (
                <Alert
                  icon={<CheckCircleIcon fontSize="inherit" />}
                  severity="success"
                  sx={{ mb: 1.5, py: 0.2, px: 1.2, borderRadius: "8px", fontSize: "0.78rem", fontWeight: 700 }}
                >
                  {successMsg}
                </Alert>
              )}

              {forgotMode ? (
                <ForgotPasswordForm initialEmail={loginEmail} onBack={() => setForgotMode(false)} />
              ) : activeTab === "login" ? (
                <LoginForm
                  onForgotPassword={() => {
                    resetState();
                    setForgotMode(true);
                  }}
                  email={loginEmail}
                  password={loginPassword}
                  onEmailChange={setLoginEmail}
                  onPasswordChange={setLoginPassword}
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword((v) => !v)}
                  loading={loading}
                  onSubmit={handleLogin}
                />
              ) : (
                <SignupForm
                  fullName={signupFullName}
                  email={signupEmail}
                  password={signupPassword}
                  onFullNameChange={setSignupFullName}
                  onEmailChange={setSignupEmail}
                  onPasswordChange={setSignupPassword}
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword((v) => !v)}
                  loading={loading}
                  onSubmit={handleSignup}
                />
              )}

              {/* Social Login Divider */}
              <Box sx={{ my: 1.4, textAlign: "center", position: "relative" }}>
                <Divider>
                  <Typography variant="caption" sx={{ color: "#9ca3af", px: 1, fontSize: "0.72rem" }}>
                    or continue with
                  </Typography>
                </Divider>
              </Box>

              <GoogleButton onClick={handleGoogleLogin} disabled={loading} />

              {/* Legal Note */}
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  textAlign: "center",
                  color: "#9ca3af",
                  fontSize: "0.68rem",
                  mt: 1.8,
                  lineHeight: 1.4,
                }}
              >
                By {activeTab === "login" ? "continuing" : "creating an account"}, you agree to our{" "}
                <span
                  onClick={() => setPolicyDialog("terms")}
                  style={{ color: "#111827", fontWeight: 700, textDecoration: "underline", cursor: "pointer" }}
                >
                  Terms
                </span>{" "}
                and{" "}
                <span
                  onClick={() => setPolicyDialog("privacy")}
                  style={{ color: "#111827", fontWeight: 700, textDecoration: "underline", cursor: "pointer" }}
                >
                  Privacy
                </span>
                .
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <PolicyDialog type={policyDialog} onClose={() => setPolicyDialog(null)} />
    </Dialog>
  );
}
