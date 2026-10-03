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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";

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

  // Login Form State
  const [loginNick, setLoginNick] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");

  // Signup Form State
  const [signupNick, setSignupNick] = useState<string>("");
  const [signupPhone, setSignupPhone] = useState<string>("");
  const [signupPassword, setSignupPassword] = useState<string>("");
  const [signupConfirm, setSignupConfirm] = useState<string>("");

  const handleLogin = async () => {
    setErrorMsg("");
    if (!loginNick || !loginPassword) {
      setErrorMsg("Please provide both nickname and password.");
      return;
    }

    try {
      const memberService = new MemberService();
      const input: LoginInput = {
        memberNick: loginNick,
        memberPassword: loginPassword,
      };
      const result = await memberService.login(input);
      onSuccess(result);
      onClose();
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
    }
  };

  const handleSignup = async () => {
    setErrorMsg("");
    if (!signupNick || !signupPhone || !signupPassword) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }
    if (signupPassword !== signupConfirm) {
      setErrorMsg("Passwords do not match!");
      return;
    }

    try {
      const memberService = new MemberService();
      const input: MemberInput = {
        memberNick: signupNick,
        memberPhone: signupPhone,
        memberPassword: signupPassword,
      };
      const result = await memberService.signup(input);
      onSuccess(result);
      onClose();
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message || "Registration failed. Try another nickname/phone."
      );
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
            bgcolor: "#0f172a",
            color: "#fff",
            border: "1px solid rgba(245, 158, 11, 0.3)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
            p: 1,
          },
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2, pt: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#f59e0b" }} />
          <Typography variant="overline" sx={{ color: "#f59e0b", fontWeight: 800, letterSpacing: 1.5 }}>
            BURAK RESTAURANT VIP
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "#94a3b8" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: 3, pt: 1, pb: 3 }}>
        <Tabs
          value={tabIndex}
          onChange={(_, val) => {
            setTabIndex(val);
            setErrorMsg("");
          }}
          variant="fullWidth"
          sx={{
            mb: 3,
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            "& .MuiTabs-indicator": { backgroundColor: "#f59e0b", height: 3 },
            "& .MuiTab-root": {
              color: "#94a3b8",
              fontWeight: 700,
              "&.Mui-selected": { color: "#f59e0b" },
            },
          }}
        >
          <Tab label="SIGN IN" />
          <Tab label="SIGN UP" />
        </Tabs>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2, fontSize: "0.82rem" }}>
            {errorMsg}
          </Alert>
        )}

        {/* Tab 0: Sign In */}
        {tabIndex === 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              fullWidth
              size="small"
              label="Nickname"
              value={loginNick}
              onChange={(e) => setLoginNick(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "#f59e0b" }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                bgcolor: "rgba(255,255,255,0.05)",
                borderRadius: 2,
                "& .MuiInputBase-input": { color: "#fff" },
                "& .MuiInputLabel-root": { color: "#94a3b8" },
              }}
            />

            <TextField
              fullWidth
              size="small"
              type={showPassword ? "text" : "password"}
              label="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
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
              sx={{
                bgcolor: "rgba(255,255,255,0.05)",
                borderRadius: 2,
                "& .MuiInputBase-input": { color: "#fff" },
                "& .MuiInputLabel-root": { color: "#94a3b8" },
              }}
            />

            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleLogin}
              sx={{
                py: 1.3,
                borderRadius: 2.5,
                fontWeight: 800,
                fontSize: "0.95rem",
                boxShadow: "0 8px 20px rgba(245, 158, 11, 0.3)",
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
              value={signupNick}
              onChange={(e) => setSignupNick(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "#f59e0b" }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                bgcolor: "rgba(255,255,255,0.05)",
                borderRadius: 2,
                "& .MuiInputBase-input": { color: "#fff" },
                "& .MuiInputLabel-root": { color: "#94a3b8" },
              }}
            />

            <TextField
              fullWidth
              size="small"
              label="Phone Number"
              placeholder="+998901234567"
              value={signupPhone}
              onChange={(e) => setSignupPhone(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ color: "#f59e0b" }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                bgcolor: "rgba(255,255,255,0.05)",
                borderRadius: 2,
                "& .MuiInputBase-input": { color: "#fff" },
                "& .MuiInputLabel-root": { color: "#94a3b8" },
              }}
            />

            <TextField
              fullWidth
              size="small"
              type={showPassword ? "text" : "password"}
              label="Password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "#f59e0b" }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                bgcolor: "rgba(255,255,255,0.05)",
                borderRadius: 2,
                "& .MuiInputBase-input": { color: "#fff" },
                "& .MuiInputLabel-root": { color: "#94a3b8" },
              }}
            />

            <TextField
              fullWidth
              size="small"
              type={showPassword ? "text" : "password"}
              label="Confirm Password"
              value={signupConfirm}
              onChange={(e) => setSignupConfirm(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "#f59e0b" }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                bgcolor: "rgba(255,255,255,0.05)",
                borderRadius: 2,
                "& .MuiInputBase-input": { color: "#fff" },
                "& .MuiInputLabel-root": { color: "#94a3b8" },
              }}
            />

            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSignup}
              sx={{
                py: 1.3,
                borderRadius: 2.5,
                fontWeight: 800,
                fontSize: "0.95rem",
                boxShadow: "0 8px 20px rgba(245, 158, 11, 0.3)",
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
