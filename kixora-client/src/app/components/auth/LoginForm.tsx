import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { AuthField } from "./AuthField";
import { authSubmitSx } from "./authStyles";

const iconSx = { color: "#9ca3af", fontSize: 16 };

interface LoginFormProps {
  email: string;
  password: string;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  showPassword: boolean;
  onTogglePassword: () => void;
  loading: boolean;
  onSubmit: () => void;
  onForgotPassword: () => void;
}

export function LoginForm(props: LoginFormProps) {
  return (
    <Stack spacing={1.4}>
      <AuthField
        label="Email address"
        placeholder="you@example.com"
        value={props.email}
        onChange={props.onEmailChange}
        icon={<EmailOutlinedIcon sx={iconSx} />}
        disabled={props.loading}
        autoFocus
        autoComplete="username"
      />
      <Box>
        <AuthField
          label="Password"
          placeholder="Enter your password"
          value={props.password}
          onChange={props.onPasswordChange}
          icon={<LockOutlinedIcon sx={iconSx} />}
          disabled={props.loading}
          autoComplete="current-password"
          password={{ visible: props.showPassword, onToggle: props.onTogglePassword }}
        />
        <Typography
          component="button"
          type="button"
          onClick={props.onForgotPassword}
          variant="caption"
          sx={{
            display: "block",
            ml: "auto",
            mt: 0.4,
            color: "#6b7280",
            fontSize: "0.72rem",
            border: 0,
            background: "none",
            cursor: "pointer",
            "&:hover": { color: "#111827", textDecoration: "underline" },
          }}
        >
          Forgot password?
        </Typography>
      </Box>
      <Button fullWidth variant="contained" onClick={props.onSubmit} disabled={props.loading} sx={authSubmitSx}>
        {props.loading ? <CircularProgress size={18} color="inherit" /> : "Log In"}
      </Button>
    </Stack>
  );
}
