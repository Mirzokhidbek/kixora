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
import RestaurantIcon from "@mui/icons-material/Restaurant";
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

  /** STANDARD LOGIN PROCESS **/
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

  /** STANDARD SIGNUP / REGISTRATION PROCESS **/
  const handleSignup = async () => {
    resetState();
    const cleanNick = signupNick.trim();
    const cleanPhone = signupPhone.trim();

    if (!cleanNick) {
      setErrorMsg("Please choose a Nickname.");
      return;
    }
    if (!cleanPhone) {
      setErrorMsg("Please enter your Phone number.");
      return;
    }
    if (!signupPassword) {
      setErrorMsg("Please enter a Password.");
      return;
    }
    if (signupPassword.length < 4) {
      setErrorMsg("Password must be at least 4 characters long.");
      return;
    }
    if (signupPassword !== signupConfirm) {
      setErrorMsg("Passwords do not match! Please check again.");
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
          `Nickname "${cleanNick}" or Phone "${cleanPhone}" is already registered. Switch to Login to sign in!`
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
            borderRadius: 5,
            bgcolor: "#ffffff",
            color: "#0f172a",
            border: "1px solid #f1f5f9",
            boxShadow: "0 25px 70px rgba(0,0,0,0.18)",
            p: { xs: 1.5, sm: 2 },
            overflow: "hidden",
          },
        },
      }}
    >
      {/* Modal Top Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", px: 1.5, pt: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 3,
              bgcolor: "#fffbeb",
              border: "1.5px solid #fef3c7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#f59e0b",
              boxShadow: "0 4px 14px rgba(245, 158, 11, 0.15)",
            }}
          >
            <RestaurantIcon sx={{ fontSize: 24 }} />
          </Box>
          <div>
            <Typography variant="h6" sx={{ fontWeight: 900, color: "#0f172a", lineHeight: 1.2 }}>
              Burak<span style={{ color: "#f59e0b" }}>food</span> VIP
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
              {activeTab === "login"
                ? "Sign in to track orders & earn rewards"
                : "Create your VIP account in seconds"}
            </Typography>
          </div>
        </Box>
        <IconButton
          onClick={onClose}
          disabled={loading}
          size="small"
          sx={{ color: "#94a3b8", "&:hover": { color: "#0f172a" } }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: { xs: 1.5, sm: 2 }, pt: 2.5, pb: 2 }} onKeyDown={handleKeyDown}>
        {/* Standard Segmented Tab Switcher */}
        <Box
          sx={{
            display: "flex",
            p: 0.6,
            bgcolor: "#f8fafc",
            borderRadius: 4,
            border: "1px solid #e2e8f0",
            mb: 3,
          }}
        >
          <Button
            fullWidth
            onClick={() => handleTabSwitch("login")}
            sx={{
              borderRadius: 3.5,
              py: 1,
              fontWeight: 800,
              fontSize: "0.9rem",
              textTransform: "none",
              color: activeTab === "login" ? "#0f172a" : "#64748b",
              bgcolor: activeTab === "login" ? "#ffffff" : "transparent",
              boxShadow: activeTab === "login" ? "0 4px 12px rgba(0,0,0,0.06)" : "none",
              border: activeTab === "login" ? "1px solid #e2e8f0" : "1px solid transparent",
              transition: "all 0.2s ease",
            }}
          >
            🔑 Login
          </Button>

          <Button
            fullWidth
            onClick={() => handleTabSwitch("signup")}
            sx={{
              borderRadius: 3.5,
              py: 1,
              fontWeight: 800,
              fontSize: "0.9rem",
              textTransform: "none",
              color: activeTab === "signup" ? "#0f172a" : "#64748b",
              bgcolor: activeTab === "signup" ? "#ffffff" : "transparent",
              boxShadow: activeTab === "signup" ? "0 4px 12px rgba(0,0,0,0.06)" : "none",
              border: activeTab === "signup" ? "1px solid #e2e8f0" : "1px solid transparent",
              transition: "all 0.2s ease",
            }}
          >
            ✨ Sign Up
          </Button>
        </Box>

        {/* Status Alerts */}
        {errorMsg && (
          <Alert
            severity={errorMsg.includes("already registered") ? "info" : "error"}
            sx={{ mb: 2.5, borderRadius: 3, fontSize: "0.82rem", fontWeight: 600 }}
            action={
              errorMsg.includes("already registered") ? (
                <Button color="inherit" size="small" onClick={() => handleTabSwitch("login")} sx={{ fontWeight: 800 }}>
                  Login
                </Button>
              ) : undefined
            }
          >
            {errorMsg}
          </Alert>
        )}

        {successMsg && (
          <Alert
            icon={<CheckCircleIcon fontSize="inherit" />}
            severity="success"
            sx={{ mb: 2.5, borderRadius: 3, fontSize: "0.85rem", fontWeight: 700 }}
          >
            {successMsg}
          </Alert>
        )}

        {/* 1. STANDARD LOGIN FORM */}
        {activeTab === "login" && (
          <Stack spacing={2.2}>
            <TextField
              fullWidth
              size="medium"
              label="Nickname"
              placeholder="e.g. Zokhidbek"
              value={loginNick}
              onChange={(e) => setLoginNick(e.target.value)}
              disabled={loading}
              autoFocus
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  bgcolor: "#ffffff",
                  "&:hover fieldset": { borderColor: "#f59e0b" },
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineOutlinedIcon sx={{ color: "#f59e0b", fontSize: 22 }} />
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
                  borderRadius: 3,
                  bgcolor: "#ffffff",
                  "&:hover fieldset": { borderColor: "#f59e0b" },
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: "#f59e0b", fontSize: 22 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                        sx={{ color: "#94a3b8" }}
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
                borderRadius: 3,
                fontWeight: 900,
                fontSize: "1rem",
                bgcolor: "#0f172a",
                color: "#ffffff",
                boxShadow: "0 8px 25px rgba(15, 23, 42, 0.25)",
                "&:hover": { bgcolor: "#1e293b" },
                mt: 1,
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Login to Account ➔"}
            </Button>

            <Box sx={{ textAlign: "center", pt: 1 }}>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Don't have an account yet?{" "}
                <strong
                  style={{ color: "#f59e0b", cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => handleTabSwitch("signup")}
                >
                  Create one now
                </strong>
              </Typography>
            </Box>
          </Stack>
        )}

        {/* 2. STANDARD SIGNUP / REGISTRATION FORM */}
        {activeTab === "signup" && (
          <Stack spacing={2}>
            <TextField
              fullWidth
              size="small"
              label="Nickname"
              placeholder="e.g. Zokhidbek or my_nickname"
              value={signupNick}
              onChange={(e) => setSignupNick(e.target.value)}
              disabled={loading}
              autoFocus
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  bgcolor: "#ffffff",
                  "&:hover fieldset": { borderColor: "#f59e0b" },
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineOutlinedIcon sx={{ color: "#f59e0b", fontSize: 20 }} />
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
                  borderRadius: 3,
                  bgcolor: "#ffffff",
                  "&:hover fieldset": { borderColor: "#f59e0b" },
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneOutlinedIcon sx={{ color: "#f59e0b", fontSize: 20 }} />
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
                  borderRadius: 3,
                  bgcolor: "#ffffff",
                  "&:hover fieldset": { borderColor: "#f59e0b" },
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: "#f59e0b", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                        sx={{ color: "#94a3b8" }}
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
                  borderRadius: 3,
                  bgcolor: "#ffffff",
                  "&:hover fieldset": { borderColor: "#f59e0b" },
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: "#f59e0b", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        size="small"
                        sx={{ color: "#94a3b8" }}
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
                borderRadius: 3,
                fontWeight: 900,
                fontSize: "1rem",
                bgcolor: "#f59e0b",
                color: "#090d16",
                boxShadow: "0 8px 25px rgba(245, 158, 11, 0.4)",
                "&:hover": { bgcolor: "#fbbf24" },
                mt: 1,
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up & Join VIP Club"}
            </Button>

            <Box sx={{ textAlign: "center", pt: 0.5 }}>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Already have an account?{" "}
                <strong
                  style={{ color: "#f59e0b", cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => handleTabSwitch("login")}
                >
                  Login here
                </strong>
              </Typography>
            </Box>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
