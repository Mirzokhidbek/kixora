import { useState } from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import MemberService from "../../services/MemberService";
import type { Member, LoginInput, MemberInput } from "../../../lib/types/member";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (member: Member) => void;
}

export function AuthModal({ open, onClose, onSuccess }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Login Form
  const [loginNick, setLoginNick] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");

  // Signup Form
  const [signupNick, setSignupNick] = useState<string>("");
  const [signupPhone, setSignupPhone] = useState<string>("");
  const [signupPassword, setSignupPassword] = useState<string>("");
  const [signupConfirm, setSignupConfirm] = useState<string>("");

  const resetState = () => {
    setErrorMsg("");
    setSuccessMsg("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleTabSwitch = (tab: "login" | "signup") => {
    setActiveTab(tab);
    resetState();
  };

  /** LOGIN PROCESS **/
  const handleLogin = async () => {
    resetState();
    const cleanNick = loginNick.trim();

    if (!cleanNick) {
      setErrorMsg("Please enter your Nickname.");
      return;
    }
    if (!loginPassword) {
      setErrorMsg("Please enter your Password.");
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
        err.response?.data?.message || "Incorrect nickname or password. Please try again."
      );
    }
  };

  /** SIGNUP PROCESS **/
  const handleSignup = async () => {
    resetState();
    const cleanNick = signupNick.trim();
    const cleanPhone = signupPhone.trim();

    if (!cleanNick) {
      setErrorMsg("Please enter a username or nickname.");
      return;
    }
    if (!cleanPhone) {
      setErrorMsg("Please enter your phone number.");
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
    if (signupPassword !== signupConfirm) {
      setErrorMsg("Passwords do not match! Please verify.");
      return;
    }

    setLoading(true);
    try {
      const memberService = new MemberService();
      const input: MemberInput = {
        memberNick: cleanNick,
        memberPhone: cleanPhone,
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
          `Nickname "${cleanNick}" or Phone "${cleanPhone}" is already registered. Please sign in instead.`
        );
        setLoginNick(cleanNick);
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

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            bgcolor: "#ffffff",
            color: "#111827",
            border: "1px solid #e5e7eb",
            boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
            p: { xs: 2, sm: 3 },
            overflow: "hidden",
          },
        },
      }}
    >
      {/* Modal Top Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 900,
              letterSpacing: "0.06em",
              color: "#000000",
              lineHeight: 1.1,
            }}
          >
            KIXORA
          </Typography>
          <Typography variant="body2" sx={{ color: "#6b7280", mt: 0.5, fontSize: "0.85rem" }}>
            {activeTab === "login"
              ? "Sign in to access exclusive drops & member benefits."
              : "Join the KIXORA club for early access & VIP drops."}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          disabled={loading}
          size="small"
          sx={{ color: "#9ca3af", "&:hover": { color: "#000000" } }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 0, pt: 1, pb: 1 }} onKeyDown={handleKeyDown}>
        {/* Segmented Tab Switcher */}
        <Box
          sx={{
            display: "flex",
            p: 0.5,
            bgcolor: "#f3f4f6",
            borderRadius: 9999,
            mb: 3,
          }}
        >
          <Button
            fullWidth
            onClick={() => handleTabSwitch("login")}
            sx={{
              borderRadius: 9999,
              py: 0.8,
              fontWeight: 700,
              fontSize: "0.85rem",
              textTransform: "none",
              color: activeTab === "login" ? "#000000" : "#6b7280",
              bgcolor: activeTab === "login" ? "#ffffff" : "transparent",
              boxShadow: activeTab === "login" ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.2s ease",
            }}
          >
            Sign In
          </Button>

          <Button
            fullWidth
            onClick={() => handleTabSwitch("signup")}
            sx={{
              borderRadius: 9999,
              py: 0.8,
              fontWeight: 700,
              fontSize: "0.85rem",
              textTransform: "none",
              color: activeTab === "signup" ? "#000000" : "#6b7280",
              bgcolor: activeTab === "signup" ? "#ffffff" : "transparent",
              boxShadow: activeTab === "signup" ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.2s ease",
            }}
          >
            Create Account
          </Button>
        </Box>

        {/* Status Alerts */}
        {errorMsg && (
          <Alert
            severity={errorMsg.includes("registered") ? "info" : "error"}
            sx={{ mb: 2, borderRadius: 2, fontSize: "0.82rem", fontWeight: 600 }}
          >
            {errorMsg}
          </Alert>
        )}

        {successMsg && (
          <Alert
            icon={<CheckCircleIcon fontSize="inherit" />}
            severity="success"
            sx={{ mb: 2, borderRadius: 2, fontSize: "0.85rem", fontWeight: 700 }}
          >
            {successMsg}
          </Alert>
        )}

        {/* 1. LOGIN FORM */}
        {activeTab === "login" && (
          <Stack spacing={2}>
            <TextField
              fullWidth
              size="medium"
              label="Nickname or Email"
              placeholder="e.g. alexander"
              value={loginNick}
              onChange={(e) => setLoginNick(e.target.value)}
              disabled={loading}
              autoFocus
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2.5,
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineOutlinedIcon sx={{ color: "#6b7280", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              fullWidth
              size="medium"
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="Enter your password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2.5,
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: "#6b7280", fontSize: 20 }} />
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
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleLogin}
              disabled={loading}
              sx={{
                py: 1.4,
                borderRadius: 9999,
                fontWeight: 800,
                fontSize: "0.95rem",
                bgcolor: "#000000",
                color: "#ffffff",
                textTransform: "none",
                boxShadow: "none",
                "&:hover": { bgcolor: "#262626", boxShadow: "0 6px 20px rgba(0,0,0,0.15)" },
                mt: 1,
              }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : "Sign In"}
            </Button>

            <Box sx={{ textAlign: "center", pt: 1 }}>
              <Typography variant="body2" sx={{ color: "#6b7280", fontSize: "0.85rem" }}>
                Don't have an account?{" "}
                <strong
                  style={{ color: "#000000", cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => handleTabSwitch("signup")}
                >
                  Create one now
                </strong>
              </Typography>
            </Box>
          </Stack>
        )}

        {/* 2. SIGNUP FORM */}
        {activeTab === "signup" && (
          <Stack spacing={2}>
            <TextField
              fullWidth
              size="small"
              label="Nickname / Full Name"
              placeholder="e.g. John Doe"
              value={signupNick}
              onChange={(e) => setSignupNick(e.target.value)}
              disabled={loading}
              autoFocus
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2.5,
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineOutlinedIcon sx={{ color: "#6b7280", fontSize: 18 }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              fullWidth
              size="small"
              label="Phone Number"
              placeholder="+998 90 123 45 67"
              value={signupPhone}
              onChange={(e) => setSignupPhone(e.target.value)}
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2.5,
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneOutlinedIcon sx={{ color: "#6b7280", fontSize: 18 }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              fullWidth
              size="small"
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="At least 4 characters"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2.5,
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: "#6b7280", fontSize: 18 }} />
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
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              fullWidth
              size="small"
              type={showConfirmPassword ? "text" : "password"}
              label="Confirm Password"
              placeholder="Re-enter password"
              value={signupConfirm}
              onChange={(e) => setSignupConfirm(e.target.value)}
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2.5,
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: "#6b7280", fontSize: 18 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        size="small"
                        sx={{ color: "#9ca3af" }}
                      >
                        {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleSignup}
              disabled={loading}
              sx={{
                py: 1.4,
                borderRadius: 9999,
                fontWeight: 800,
                fontSize: "0.95rem",
                bgcolor: "#000000",
                color: "#ffffff",
                textTransform: "none",
                boxShadow: "none",
                "&:hover": { bgcolor: "#262626", boxShadow: "0 6px 20px rgba(0,0,0,0.15)" },
                mt: 1,
              }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : "Create Account"}
            </Button>

            <Box sx={{ textAlign: "center", pt: 0.5 }}>
              <Typography variant="body2" sx={{ color: "#6b7280", fontSize: "0.85rem" }}>
                Already have an account?{" "}
                <strong
                  style={{ color: "#000000", cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => handleTabSwitch("login")}
                >
                  Sign In
                </strong>
              </Typography>
            </Box>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
