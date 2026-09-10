import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Stack,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { signInWithGoogle } from "../../../lib/firebase";
import MemberService from "../../services/MemberService";
import type { Member, LoginInput, MemberInput } from "../../../lib/types/member";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (member: Member) => void;
}

export function AuthModal({ open, onClose, onSuccess }: AuthModalProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");

  // Signup Form State
  const [signupFullName, setSignupFullName] = useState<string>("");
  const [signupEmail, setSignupEmail] = useState<string>("");
  const [signupPassword, setSignupPassword] = useState<string>("");

  // Policy Modal State
  const [policyDialog, setPolicyDialog] = useState<"terms" | "privacy" | null>(null);

  const resetState = () => {
    setErrorMsg("");
    setSuccessMsg("");
    setShowPassword(false);
  };

  const handleTabSwitch = (tab: "login" | "signup") => {
    setActiveTab(tab);
    resetState();
  };

  /** FIREBASE GOOGLE 1-CLICK POPUP SIGN-IN **/
  const handleFirebaseGoogleLogin = async () => {
    resetState();
    setLoading(true);
    try {
      const userCredential = await signInWithGoogle();
      const user = userCredential.user;
      if (!user.email) {
        throw new Error("No email associated with this Google account.");
      }

      const memberService = new MemberService();
      const member = await memberService.googleLogin("", {
        googleId: user.uid,
        email: user.email,
        name: user.displayName || user.email.split("@")[0],
        picture: user.photoURL || "",
      });

      const nick = member?.memberNick || user.displayName || user.email?.split("@")[0] || "User";
      setSuccessMsg(`Welcome back, ${nick}! ✨`);
      setTimeout(() => {
        if (member) onSuccess(member);
        onClose();
        setLoading(false);
      }, 400);
    } catch (err: any) {
      setLoading(false);
      if (err.code === "auth/popup-closed-by-user") {
        return;
      }
      setErrorMsg(err.response?.data?.message || err.message || "Google sign in error. Please try again.");
    }
  };

  /** LOGIN PROCESS **/
  const handleLogin = async () => {
    resetState();
    const cleanEmail = loginEmail.trim();

    if (!cleanEmail) {
      setErrorMsg("Please enter your email address.");
      return;
    }
    if (!loginPassword) {
      setErrorMsg("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      const memberService = new MemberService();
      const input: LoginInput = {
        memberEmail: cleanEmail,
        memberNick: cleanEmail,
        memberPassword: loginPassword,
      };
      const member = await memberService.login(input);
      const nick = member?.memberNick || cleanEmail.split("@")[0] || "User";
      setSuccessMsg(`Welcome back, ${nick}!`);
      setTimeout(() => {
        if (member) onSuccess(member);
        onClose();
        setLoading(false);
      }, 400);
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(
        err.response?.data?.message || "Incorrect email or password. Please try again."
      );
    }
  };

  /** SIGNUP PROCESS **/
  const handleSignup = async () => {
    resetState();
    const cleanName = signupFullName.trim();
    const cleanEmail = signupEmail.trim();

    if (!cleanName) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!cleanEmail) {
      setErrorMsg("Please enter your email address.");
      return;
    }
    if (!signupPassword) {
      setErrorMsg("Please enter a password.");
      return;
    }
    if (signupPassword.length < 4) {
      setErrorMsg("Password must be at least 4 characters long.");
      return;
    }

    setLoading(true);
    try {
      const memberService = new MemberService();
      const input: MemberInput = {
        memberNick: cleanName,
        memberEmail: cleanEmail.toLowerCase(),
        memberPhone: cleanEmail.includes("@") ? "+998901234567" : cleanEmail,
        memberPassword: signupPassword,
      };
      const member = await memberService.signup(input);
      const nick = member?.memberNick || cleanName || "User";
      setSuccessMsg(`Account created! Welcome, ${nick}!`);
      setTimeout(() => {
        if (member) onSuccess(member);
        onClose();
        setLoading(false);
      }, 500);
    } catch (err: any) {
      setLoading(false);
      const msg = err.response?.data?.message || "";
      if (
        msg.includes("already used") ||
        msg.includes("USED_NICK_PHONE") ||
        msg.includes("nick or phone") ||
        err.response?.status === 400
      ) {
        setErrorMsg(
          `Account "${cleanName}" is already registered. Please sign in instead.`
        );
        setLoginEmail(cleanName);
      } else {
        setErrorMsg(msg || "Registration failed. Please check your details and try again.");
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (activeTab === "login") {
        handleLogin();
      } else {
        handleSignup();
      }
    }
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
          {/* Left Column: Dark Sneaker Brand Showcase */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              width: "42%",
              position: "relative",
              flexDirection: "column",
              justifyContent: "space-between",
              p: 3,
              bgcolor: "#050505",
              color: "#ffffff",
              overflow: "hidden",
            }}
          >
            {/* Background Studio Shot */}
            <Box
              component="img"
              src="/img/kixora/auth_bg.jpg"
              alt="KIXORA Sneaker Crafting"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                zIndex: 0,
                opacity: 0.85,
              }}
            />

            {/* Dark Cinematic Vignette */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)",
                zIndex: 1,
              }}
            />

            {/* Top Logo */}
            <Box sx={{ position: "relative", zIndex: 2 }}>
              <Box
                component="img"
                src="/img/kixora/logo.png"
                alt="KIXORA"
                sx={{
                  height: 26,
                  width: "auto",
                  objectFit: "contain",
                  filter: "brightness(0) invert(1)",
                }}
              />
            </Box>

            {/* Bottom Slogan & Explore Link */}
            <Box sx={{ position: "relative", zIndex: 2 }}>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 900,
                  fontSize: "1.45rem",
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                  color: "#ffffff",
                  mb: 0.6,
                }}
              >
                Step Into <br /> More
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#9ca3af",
                  lineHeight: 1.45,
                  fontSize: "0.76rem",
                  mb: 2,
                  maxWidth: 220,
                }}
              >
                Premium shoes for every journey. Style. Comfort. Performance.
              </Typography>

              <Box
                onClick={handleExplore}
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "0.78rem",
                  cursor: "pointer",
                  transition: "opacity 0.2s ease",
                  "&:hover": { opacity: 0.8 },
                }}
              >
                <span>&mdash; Explore Collection</span>
                <Box
                  sx={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ArrowForwardIcon sx={{ fontSize: 11 }} />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Right Column: Clean Auth Form */}
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

              {/* 1. LOGIN FORM */}
              {activeTab === "login" && (
                <Stack spacing={1.4}>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 600, color: "#374151", mb: 0.3, display: "block", fontSize: "0.76rem" }}
                    >
                      Email address
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="you@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      disabled={loading}
                      autoFocus
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          bgcolor: "#fcfcfd",
                          fontSize: "0.82rem",
                          "& fieldset": { borderColor: "#e5e7eb" },
                          "&:hover fieldset": { borderColor: "#d1d5db" },
                          "&.Mui-focused fieldset": { borderColor: "#111827" },
                        },
                        "& .MuiInputBase-input": { py: 0.8 },
                      }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailOutlinedIcon sx={{ color: "#9ca3af", fontSize: 16 }} />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 600, color: "#374151", mb: 0.3, display: "block", fontSize: "0.76rem" }}
                    >
                      Password
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      disabled={loading}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          bgcolor: "#fcfcfd",
                          fontSize: "0.82rem",
                          "& fieldset": { borderColor: "#e5e7eb" },
                          "&:hover fieldset": { borderColor: "#d1d5db" },
                          "&.Mui-focused fieldset": { borderColor: "#111827" },
                        },
                        "& .MuiInputBase-input": { py: 0.8 },
                      }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockOutlinedIcon sx={{ color: "#9ca3af", fontSize: 16 }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                size="small"
                                sx={{ color: "#9ca3af", p: 0.4 }}
                              >
                                {showPassword ? (
                                  <VisibilityOffOutlinedIcon sx={{ fontSize: 16 }} />
                                ) : (
                                  <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                    <Box sx={{ textAlign: "right", mt: 0.4 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#6b7280",
                          cursor: "pointer",
                          fontWeight: 500,
                          fontSize: "0.72rem",
                          "&:hover": { color: "#111827" },
                        }}
                      >
                        Forgot password?
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleLogin}
                    disabled={loading}
                    sx={{
                      py: 0.9,
                      borderRadius: "8px",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      bgcolor: "#111827",
                      color: "#ffffff",
                      textTransform: "none",
                      boxShadow: "none",
                      "&:hover": { bgcolor: "#000000", boxShadow: "none" },
                    }}
                  >
                    {loading ? <CircularProgress size={18} color="inherit" /> : "Log In"}
                  </Button>
                </Stack>
              )}

              {/* 2. SIGNUP FORM */}
              {activeTab === "signup" && (
                <Stack spacing={1.2}>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 600, color: "#374151", mb: 0.3, display: "block", fontSize: "0.76rem" }}
                    >
                      Full name
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="John Doe"
                      value={signupFullName}
                      onChange={(e) => setSignupFullName(e.target.value)}
                      disabled={loading}
                      autoFocus
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          bgcolor: "#fcfcfd",
                          fontSize: "0.82rem",
                          "& fieldset": { borderColor: "#e5e7eb" },
                          "&:hover fieldset": { borderColor: "#d1d5db" },
                          "&.Mui-focused fieldset": { borderColor: "#111827" },
                        },
                        "& .MuiInputBase-input": { py: 0.8 },
                      }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonOutlineOutlinedIcon sx={{ color: "#9ca3af", fontSize: 16 }} />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 600, color: "#374151", mb: 0.3, display: "block", fontSize: "0.76rem" }}
                    >
                      Email address
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="you@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      disabled={loading}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          bgcolor: "#fcfcfd",
                          fontSize: "0.82rem",
                          "& fieldset": { borderColor: "#e5e7eb" },
                          "&:hover fieldset": { borderColor: "#d1d5db" },
                          "&.Mui-focused fieldset": { borderColor: "#111827" },
                        },
                        "& .MuiInputBase-input": { py: 0.8 },
                      }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailOutlinedIcon sx={{ color: "#9ca3af", fontSize: 16 }} />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 600, color: "#374151", mb: 0.3, display: "block", fontSize: "0.76rem" }}
                    >
                      Password
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      disabled={loading}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          bgcolor: "#fcfcfd",
                          fontSize: "0.82rem",
                          "& fieldset": { borderColor: "#e5e7eb" },
                          "&:hover fieldset": { borderColor: "#d1d5db" },
                          "&.Mui-focused fieldset": { borderColor: "#111827" },
                        },
                        "& .MuiInputBase-input": { py: 0.8 },
                      }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockOutlinedIcon sx={{ color: "#9ca3af", fontSize: 16 }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                size="small"
                                sx={{ color: "#9ca3af", p: 0.4 }}
                              >
                                {showPassword ? (
                                  <VisibilityOffOutlinedIcon sx={{ fontSize: 16 }} />
                                ) : (
                                  <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSignup}
                    disabled={loading}
                    sx={{
                      py: 0.9,
                      borderRadius: "8px",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      bgcolor: "#111827",
                      color: "#ffffff",
                      textTransform: "none",
                      boxShadow: "none",
                      "&:hover": { bgcolor: "#000000", boxShadow: "none" },
                    }}
                  >
                    {loading ? <CircularProgress size={18} color="inherit" /> : "Sign Up"}
                  </Button>
                </Stack>
              )}

              {/* Social Login Divider */}
              <Box sx={{ my: 1.4, textAlign: "center", position: "relative" }}>
                <Divider>
                  <Typography variant="caption" sx={{ color: "#9ca3af", px: 1, fontSize: "0.72rem" }}>
                    or continue with
                  </Typography>
                </Divider>
              </Box>

              {/* Single Google Auth Button */}
              <Box>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleFirebaseGoogleLogin}
                  disabled={loading}
                  sx={{
                    borderRadius: "8px",
                    py: 0.8,
                    borderColor: "#e5e7eb",
                    color: "#111827",
                    fontWeight: 600,
                    fontSize: "0.82rem",
                    textTransform: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1.2,
                    "&:hover": { borderColor: "#111827", bgcolor: "#f9fafb" },
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </Box>

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

      {/* Terms & Privacy Policy Modal */}
      <Dialog
        open={Boolean(policyDialog)}
        onClose={() => setPolicyDialog(null)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: "16px",
              bgcolor: "#ffffff",
              color: "#111827",
              p: 3,
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.25)",
            },
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, pb: 1, borderBottom: "1px solid #f3f4f6" }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#111827", fontSize: "1.1rem" }}>
            {policyDialog === "terms" ? "KIXORA Terms of Service" : "KIXORA Privacy Policy"}
          </Typography>
          <IconButton onClick={() => setPolicyDialog(null)} size="small" sx={{ color: "#6b7280" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ maxHeight: 360, overflowY: "auto", pr: 1 }}>
          {policyDialog === "terms" ? (
            <Stack spacing={2} sx={{ color: "#4b5563", fontSize: "0.85rem", lineHeight: 1.7 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#111827", mb: 0.3 }}>
                  1. Acceptance of Terms
                </Typography>
                <Typography variant="body2" sx={{ color: "#4b5563", fontSize: "0.82rem" }}>
                  By creating an account or placing orders on KIXORA, you agree to comply with our authentic luxury footwear purchase conditions and verified membership protocols.
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#111827", mb: 0.3 }}>
                  2. 100% Authentic Footwear Guarantee
                </Typography>
                <Typography variant="body2" sx={{ color: "#4b5563", fontSize: "0.82rem" }}>
                  Every pair of sneakers, boots, and athletic footwear available on KIXORA is rigorously inspected for authenticity and certified by manufacturer serial numbers.
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#111827", mb: 0.3 }}>
                  3. 30-Day Free Returns & Exchanges
                </Typography>
                <Typography variant="body2" sx={{ color: "#4b5563", fontSize: "0.82rem" }}>
                  Items may be returned or exchanged within 30 days of delivery, provided they are in unworn, brand-new condition with all original packaging intact.
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#111827", mb: 0.3 }}>
                  4. Express Global Shipping
                </Typography>
                <Typography variant="body2" sx={{ color: "#4b5563", fontSize: "0.82rem" }}>
                  Complimentary express shipping is provided on all orders exceeding $100 with full real-time courier tracking.
                </Typography>
              </Box>
            </Stack>
          ) : (
            <Stack spacing={2} sx={{ color: "#4b5563", fontSize: "0.85rem", lineHeight: 1.7 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#111827", mb: 0.3 }}>
                  1. Data Protection & Encryption
                </Typography>
                <Typography variant="body2" sx={{ color: "#4b5563", fontSize: "0.82rem" }}>
                  We employ end-to-end 256-bit SSL encryption to safeguard your login credentials, shipping address, and personal account information.
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#111827", mb: 0.3 }}>
                  2. PCI-DSS Secure Payments
                </Typography>
                <Typography variant="body2" sx={{ color: "#4b5563", fontSize: "0.82rem" }}>
                  KIXORA does not store your credit card CVV numbers or sensitive financial data. All transactions are securely processed through certified payment gateways.
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#111827", mb: 0.3 }}>
                  3. Privacy & Zero Third-Party Selling
                </Typography>
                <Typography variant="body2" sx={{ color: "#4b5563", fontSize: "0.82rem" }}>
                  Your personal data is strictly used for order fulfillment and VIP drop announcements. We never sell or distribute your private information to third parties.
                </Typography>
              </Box>
            </Stack>
          )}
        </Box>

        <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid #f3f4f6", textAlign: "right" }}>
          <Button
            variant="contained"
            onClick={() => setPolicyDialog(null)}
            sx={{
              bgcolor: "#000000",
              color: "#ffffff",
              borderRadius: "8px",
              px: 3,
              fontWeight: 700,
              fontSize: "0.82rem",
              textTransform: "none",
              "&:hover": { bgcolor: "#262626" },
            }}
          >
            I Understand
          </Button>
        </Box>
      </Dialog>
    </Dialog>
  );
}
