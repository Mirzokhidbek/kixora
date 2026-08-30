import { useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Alert,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import { GoogleLogin } from "@react-oauth/google";

import MemberService from "../../services/MemberService";
import type { Member, LoginInput, MemberInput } from "../../../lib/types/member";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (member: Member) => void;
}

export function AuthModal({ open, onClose, onSuccess }: AuthModalProps) {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Login Form State
  const [loginNick, setLoginNick] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");

  // Signup Form State
  const [signupNick, setSignupNick] = useState<string>("");
  const [signupPhone, setSignupPhone] = useState<string>("");
  const [signupPassword, setSignupPassword] = useState<string>("");
  const [signupConfirm, setSignupConfirm] = useState<string>("");

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setErrorMsg("");
    try {
      if (!credentialResponse.credential) {
        throw new Error("No Google credential returned");
      }
      const memberService = new MemberService();
      const member = await memberService.googleLogin(credentialResponse.credential);
      onSuccess(member);
      onClose();
    } catch (err: any) {
      console.error("Google Auth error:", err);
      setErrorMsg(
        err.response?.data?.message || "Google Authentication failed. Please try standard sign in."
      );
    }
  };

  /** 1-CLICK INSTANT VIP LOGIN (FOR ALL USERS) **/
  const handleFastGuestLogin = async () => {
    setErrorMsg("");
    setLoading(true);
    try {
      const memberService = new MemberService();
      // Generate a fresh guaranteed-unique guest account
      const randomSuffix = `${Date.now().toString().slice(-4)}_${Math.floor(100 + Math.random() * 900)}`;
      const guestNick = `Guest_${randomSuffix}`;
      const guestPhone = `+99890${Math.floor(1000000 + Math.random() * 9000000)}`;

      const input: MemberInput = {
        memberNick: guestNick,
        memberPhone: guestPhone,
        memberPassword: "VIPPassword123!",
      };
      const result = await memberService.signup(input);
      onSuccess(result);
      onClose();
    } catch {
      // Fallback: Login with active demo account
      try {
        const memberService = new MemberService();
        const demoLogin: LoginInput = {
          memberNick: "Zokhidbek",
          memberPassword: "12345678",
        };
        const result = await memberService.login(demoLogin);
        onSuccess(result);
        onClose();
      } catch (e: any) {
        setErrorMsg(e.response?.data?.message || "Instant login failed. Please sign in below.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setErrorMsg("");
    if (!loginNick || !loginPassword) {
      setErrorMsg("Please enter both Nickname and Password.");
      return;
    }

    try {
      const memberService = new MemberService();
      const input: LoginInput = {
        memberNick: loginNick.trim(),
        memberPassword: loginPassword,
      };
      const result = await memberService.login(input);
      onSuccess(result);
      onClose();
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message || "Incorrect nickname or password. Please check your details."
      );
    }
  };

  const handleSignup = async () => {
    setErrorMsg("");
    if (!signupNick.trim() || !signupPhone.trim() || !signupPassword) {
      setErrorMsg("Please fill in all fields (Nickname, Phone, Password).");
      return;
    }
    if (signupPassword !== signupConfirm) {
      setErrorMsg("Passwords do not match!");
      return;
    }

    try {
      const memberService = new MemberService();
      const input: MemberInput = {
        memberNick: signupNick.trim(),
        memberPhone: signupPhone.trim(),
        memberPassword: signupPassword,
      };
      const result = await memberService.signup(input);
      onSuccess(result);
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || "";
      if (msg.includes("already used") || msg.includes("USED_NICK_PHONE")) {
        setErrorMsg(`"${signupNick}" is already registered! Please switch to SIGN IN tab to log in.`);
        setLoginNick(signupNick.trim());
      } else {
        setErrorMsg(msg || "Registration failed. Please try a different nickname.");
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            bgcolor: "#ffffff",
            color: "#0f172a",
            border: "1px solid #f1f5f9",
            boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
            p: 1,
          },
        },
      }}
    >
      {/* Modal Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2, pt: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#f59e0b" }} />
          <Typography variant="overline" sx={{ color: "#f59e0b", fontWeight: 900, letterSpacing: 1.5 }}>
            BURAKFOOD AUTHENTICATION
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "#94a3b8" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 3, pt: 1, pb: 3 }}>
        {/* 1. Instant 1-Click Fast VIP Login */}
        <Button
          fullWidth
          variant="contained"
          startIcon={<FlashOnIcon sx={{ color: "#000" }} />}
          onClick={handleFastGuestLogin}
          disabled={loading}
          sx={{
            py: 1.3,
            borderRadius: 3,
            fontWeight: 900,
            fontSize: "0.95rem",
            bgcolor: "#f59e0b",
            color: "#090d16",
            boxShadow: "0 6px 18px rgba(245, 158, 11, 0.4)",
            "&:hover": { bgcolor: "#fbbf24" },
            mb: 2,
          }}
        >
          {loading ? "Logging in..." : "⚡ 1-Click Instant VIP Login"}
        </Button>

        {/* 2. Official Google Sign-In */}
        <Box sx={{ mb: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setErrorMsg("Google Sign-In failed or was closed.")}
            theme="outline"
            size="large"
            shape="pill"
            text="continue_with"
            width="320"
          />
        </Box>

        <Divider sx={{ my: 2.5, color: "#94a3b8", fontSize: "0.78rem", fontWeight: 800 }}>
          OR WITH NICKNAME & PASSWORD
        </Divider>

        <Tabs
          value={tabIndex}
          onChange={(_, val) => {
            setTabIndex(val);
            setErrorMsg("");
          }}
          variant="fullWidth"
          sx={{
            mb: 3,
            borderBottom: "1px solid #f1f5f9",
            "& .MuiTabs-indicator": { backgroundColor: "#f59e0b", height: 3, borderRadius: 2 },
            "& .MuiTab-root": {
              color: "#64748b",
              fontWeight: 800,
              fontSize: "0.9rem",
              "&.Mui-selected": { color: "#f59e0b" },
            },
          }}
        >
          <Tab label="SIGN IN" />
          <Tab label="SIGN UP" />
        </Tabs>

        {errorMsg && (
          <Alert severity={errorMsg.includes("already registered") ? "info" : "error"} sx={{ mb: 2.5, borderRadius: 2.5, fontSize: "0.82rem", fontWeight: 600 }}>
            {errorMsg}
          </Alert>
        )}

        {/* Tab 0: Sign In */}
        {tabIndex === 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.2 }}>
            <TextField
              fullWidth
              size="small"
              label="Nickname"
              placeholder="e.g. Zokhidbek or your nickname"
              value={loginNick}
              onChange={(e) => setLoginNick(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "#f59e0b" }} />
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
              placeholder="Your password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "#f59e0b" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: "#94a3b8" }}>
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              variant="contained"
              size="large"
              onClick={handleLogin}
              sx={{
                py: 1.3,
                borderRadius: 3,
                fontWeight: 800,
                fontSize: "0.95rem",
                bgcolor: "#0f172a",
                color: "#fff",
                boxShadow: "0 8px 20px rgba(15, 23, 42, 0.25)",
                "&:hover": { bgcolor: "#1e293b" },
                mt: 1,
              }}
            >
              Sign In to Account
            </Button>
          </Box>
        )}

        {/* Tab 1: Sign Up */}
        {tabIndex === 1 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              size="small"
              label="Nickname"
              placeholder="Choose a unique nickname"
              value={signupNick}
              onChange={(e) => setSignupNick(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "#f59e0b" }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              fullWidth
              size="small"
              label="Phone Number"
              placeholder="+998901234567"
              value={signupPhone}
              onChange={(e) => setSignupPhone(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ color: "#f59e0b" }} />
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
              placeholder="At least 6 characters"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "#f59e0b" }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              fullWidth
              size="small"
              type={showPassword ? "text" : "password"}
              label="Confirm Password"
              placeholder="Re-enter password"
              value={signupConfirm}
              onChange={(e) => setSignupConfirm(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "#f59e0b" }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              variant="contained"
              size="large"
              onClick={handleSignup}
              sx={{
                py: 1.3,
                borderRadius: 3,
                fontWeight: 800,
                fontSize: "0.95rem",
                bgcolor: "#0f172a",
                color: "#fff",
                boxShadow: "0 8px 20px rgba(15, 23, 42, 0.25)",
                "&:hover": { bgcolor: "#1e293b" },
                mt: 1,
              }}
            >
              Create VIP Account
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
