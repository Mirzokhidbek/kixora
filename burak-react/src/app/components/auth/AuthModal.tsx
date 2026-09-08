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

  const resetState = () => {
    setErrorMsg("");
    setSuccessMsg("");
    setShowPassword(false);
  };

  const handleTabSwitch = (tab: "login" | "signup") => {
    setActiveTab(tab);
    resetState();
  };

  /** LOGIN PROCESS **/
  const handleLogin = async () => {
    resetState();
    const cleanNick = loginEmail.trim();

    if (!cleanNick) {
      setErrorMsg("Please enter your email or nickname.");
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
        memberNick: cleanNick,
        memberPassword: loginPassword,
      };
      const member = await memberService.login(input);
      setSuccessMsg(`Welcome back, ${member.memberNick}!`);
      setTimeout(() => {
        onSuccess(member);
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
      setErrorMsg("Please enter your email address or phone.");
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
        memberPhone: cleanEmail.includes("@") ? "+998901234567" : cleanEmail,
        memberPassword: signupPassword,
      };
      const member = await memberService.signup(input);
      setSuccessMsg(`Account created! Welcome, ${member.memberNick}!`);
      setTimeout(() => {
        onSuccess(member);
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
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: "20px",
            bgcolor: "#ffffff",
            color: "#111827",
            overflow: "hidden",
            boxShadow: "0 30px 90px rgba(0, 0, 0, 0.35)",
            maxWidth: 890,
            m: { xs: 2, sm: 3 },
          },
        },
      }}
    >
      <DialogContent sx={{ p: 0, overflow: "hidden" }} onKeyDown={handleKeyDown}>
        <Box sx={{ display: "flex", minHeight: { xs: "auto", md: 590 } }}>
          {/* Left Column: Dark Sneaker Brand Showcase */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              width: "44%",
              position: "relative",
              flexDirection: "column",
              justifyContent: "space-between",
              p: 4.5,
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
                  height: 36,
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
                  fontSize: "2rem",
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                  color: "#ffffff",
                  mb: 1.2,
                }}
              >
                Step Into <br /> More
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#9ca3af",
                  lineHeight: 1.6,
                  fontSize: "0.88rem",
                  mb: 3.5,
                  maxWidth: 260,
                }}
              >
                Premium shoes for every journey. Style. Comfort. Performance.
              </Typography>

              <Box
                onClick={handleExplore}
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1.2,
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  transition: "opacity 0.2s ease",
                  "&:hover": { opacity: 0.8 },
                }}
              >
                <span>&mdash; Explore Collection</span>
                <Box
                  sx={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ArrowForwardIcon sx={{ fontSize: 13 }} />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Right Column: Clean Auth Form */}
          <Box
            sx={{
              width: { xs: "100%", md: "56%" },
              p: { xs: 3.5, sm: 5 },
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
                gap: 2,
                mb: 3,
              }}
            >
              <Typography variant="body2" sx={{ color: "#6b7280", fontSize: "0.82rem" }}>
                {activeTab === "login" ? "Don't have an account? " : "Already have an account? "}
                <Typography
                  component="span"
                  sx={{
                    color: "#a67c52",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: "0.82rem",
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
                  "&:hover": { color: "#000000", bgcolor: "#f3f4f6" },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Form Inner Content */}
            <Box sx={{ maxWidth: 360, width: "100%", mx: "auto" }}>
              {/* Heading */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 800,
                    color: "#111827",
                    fontSize: "1.75rem",
                    letterSpacing: "-0.02em",
                    mb: 0.6,
                  }}
                >
                  {activeTab === "login" ? "Welcome Back" : "Create Account"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#6b7280", fontSize: "0.86rem", lineHeight: 1.5 }}
                >
                  {activeTab === "login"
                    ? "Log in to your Kixora account"
                    : "Join Kixora and get exclusive offers, new arrivals and more."}
                </Typography>
              </Box>

              {/* Status Notifications */}
              {errorMsg && (
                <Alert
                  severity={errorMsg.includes("registered") ? "info" : "error"}
                  sx={{ mb: 2, borderRadius: "10px", fontSize: "0.82rem", fontWeight: 600 }}
                >
                  {errorMsg}
                </Alert>
              )}

              {successMsg && (
                <Alert
                  icon={<CheckCircleIcon fontSize="inherit" />}
                  severity="success"
                  sx={{ mb: 2, borderRadius: "10px", fontSize: "0.84rem", fontWeight: 700 }}
                >
                  {successMsg}
                </Alert>
              )}

              {/* 1. LOGIN FORM */}
              {activeTab === "login" && (
                <Stack spacing={2}>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 600, color: "#374151", mb: 0.6, display: "block", fontSize: "0.82rem" }}
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
                          borderRadius: "10px",
                          bgcolor: "#fcfcfd",
                          fontSize: "0.88rem",
                          "& fieldset": { borderColor: "#e5e7eb" },
                          "&:hover fieldset": { borderColor: "#d1d5db" },
                          "&.Mui-focused fieldset": { borderColor: "#111827" },
                        },
                      }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailOutlinedIcon sx={{ color: "#9ca3af", fontSize: 18 }} />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 600, color: "#374151", mb: 0.6, display: "block", fontSize: "0.82rem" }}
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
                          borderRadius: "10px",
                          bgcolor: "#fcfcfd",
                          fontSize: "0.88rem",
                          "& fieldset": { borderColor: "#e5e7eb" },
                          "&:hover fieldset": { borderColor: "#d1d5db" },
                          "&.Mui-focused fieldset": { borderColor: "#111827" },
                        },
                      }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockOutlinedIcon sx={{ color: "#9ca3af", fontSize: 18 }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                size="small"
                                sx={{ color: "#9ca3af" }}
                              >
                                {showPassword ? (
                                  <VisibilityOffOutlinedIcon fontSize="small" />
                                ) : (
                                  <VisibilityOutlinedIcon fontSize="small" />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                    <Box sx={{ textAlign: "right", mt: 0.8 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#6b7280",
                          cursor: "pointer",
                          fontWeight: 500,
                          fontSize: "0.78rem",
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
                      py: 1.3,
                      borderRadius: "10px",
                      fontWeight: 700,
                      fontSize: "0.92rem",
                      bgcolor: "#111827",
                      color: "#ffffff",
                      textTransform: "none",
                      boxShadow: "none",
                      "&:hover": { bgcolor: "#000000", boxShadow: "none" },
                    }}
                  >
                    {loading ? <CircularProgress size={22} color="inherit" /> : "Log In"}
                  </Button>
                </Stack>
              )}

              {/* 2. SIGNUP FORM */}
              {activeTab === "signup" && (
                <Stack spacing={1.8}>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 600, color: "#374151", mb: 0.5, display: "block", fontSize: "0.82rem" }}
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
                          borderRadius: "10px",
                          bgcolor: "#fcfcfd",
                          fontSize: "0.88rem",
                          "& fieldset": { borderColor: "#e5e7eb" },
                          "&:hover fieldset": { borderColor: "#d1d5db" },
                          "&.Mui-focused fieldset": { borderColor: "#111827" },
                        },
                      }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonOutlineOutlinedIcon sx={{ color: "#9ca3af", fontSize: 18 }} />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 600, color: "#374151", mb: 0.5, display: "block", fontSize: "0.82rem" }}
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
                          borderRadius: "10px",
                          bgcolor: "#fcfcfd",
                          fontSize: "0.88rem",
                          "& fieldset": { borderColor: "#e5e7eb" },
                          "&:hover fieldset": { borderColor: "#d1d5db" },
                          "&.Mui-focused fieldset": { borderColor: "#111827" },
                        },
                      }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailOutlinedIcon sx={{ color: "#9ca3af", fontSize: 18 }} />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 600, color: "#374151", mb: 0.5, display: "block", fontSize: "0.82rem" }}
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
                          borderRadius: "10px",
                          bgcolor: "#fcfcfd",
                          fontSize: "0.88rem",
                          "& fieldset": { borderColor: "#e5e7eb" },
                          "&:hover fieldset": { borderColor: "#d1d5db" },
                          "&.Mui-focused fieldset": { borderColor: "#111827" },
                        },
                      }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockOutlinedIcon sx={{ color: "#9ca3af", fontSize: 18 }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                                size="small"
                                sx={{ color: "#9ca3af" }}
                              >
                                {showPassword ? (
                                  <VisibilityOffOutlinedIcon fontSize="small" />
                                ) : (
                                  <VisibilityOutlinedIcon fontSize="small" />
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
                      py: 1.3,
                      borderRadius: "10px",
                      fontWeight: 700,
                      fontSize: "0.92rem",
                      bgcolor: "#111827",
                      color: "#ffffff",
                      textTransform: "none",
                      boxShadow: "none",
                      "&:hover": { bgcolor: "#000000", boxShadow: "none" },
                    }}
                  >
                    {loading ? <CircularProgress size={22} color="inherit" /> : "Sign Up"}
                  </Button>
                </Stack>
              )}

              {/* Social Login Divider */}
              <Box sx={{ my: 2.2, textAlign: "center", position: "relative" }}>
                <Divider>
                  <Typography variant="caption" sx={{ color: "#9ca3af", px: 1.5, fontSize: "0.76rem" }}>
                    or continue with
                  </Typography>
                </Divider>
              </Box>

              {/* Google & Apple Auth Buttons */}
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: "10px",
                    py: 0.9,
                    borderColor: "#e5e7eb",
                    color: "#111827",
                    fontWeight: 600,
                    fontSize: "0.82rem",
                    textTransform: "none",
                    "&:hover": { borderColor: "#111827", bgcolor: "#f9fafb" },
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" style={{ marginRight: 8 }}>
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
                  Google
                </Button>

                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: "10px",
                    py: 0.9,
                    borderColor: "#e5e7eb",
                    color: "#111827",
                    fontWeight: 600,
                    fontSize: "0.82rem",
                    textTransform: "none",
                    "&:hover": { borderColor: "#111827", bgcolor: "#f9fafb" },
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="#000000" style={{ marginRight: 8 }}>
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.76 1.04-1.82.92-2.88-.9.04-1.99.6-2.63 1.35-.58.67-.99 1.76-.85 2.8.99.08 2.02-.51 2.56-1.27z" />
                  </svg>
                  Apple
                </Button>
              </Box>

              {/* Legal Note */}
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  textAlign: "center",
                  color: "#9ca3af",
                  fontSize: "0.72rem",
                  mt: 3,
                  lineHeight: 1.5,
                }}
              >
                By {activeTab === "login" ? "continuing" : "creating an account"}, you agree to our{" "}
                <span style={{ color: "#111827", fontWeight: 600, textDecoration: "underline", cursor: "pointer" }}>
                  Terms of Service
                </span>{" "}
                and{" "}
                <span style={{ color: "#111827", fontWeight: 600, textDecoration: "underline", cursor: "pointer" }}>
                  Privacy Policy
                </span>
                .
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
