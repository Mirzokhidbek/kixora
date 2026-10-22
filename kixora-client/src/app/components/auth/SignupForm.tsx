import { Button, CircularProgress, Stack } from "@mui/material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { AuthField, authSubmitSx } from "./AuthField";

const iconSx = { color: "#9ca3af", fontSize: 16 };

interface SignupFormProps {
  fullName: string;
  email: string;
  password: string;
  onFullNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  showPassword: boolean;
  onTogglePassword: () => void;
  loading: boolean;
  onSubmit: () => void;
}

export function SignupForm(props: SignupFormProps) {
  return (
    <Stack spacing={1.2}>
      <AuthField
        label="Full name"
        placeholder="John Doe"
        value={props.fullName}
        onChange={props.onFullNameChange}
        icon={<PersonOutlineOutlinedIcon sx={iconSx} />}
        disabled={props.loading}
        autoFocus
        autoComplete="name"
      />
      <AuthField
        label="Email address"
        placeholder="you@example.com"
        value={props.email}
        onChange={props.onEmailChange}
        icon={<EmailOutlinedIcon sx={iconSx} />}
        disabled={props.loading}
        autoComplete="email"
      />
      <AuthField
        label="Password"
        placeholder="At least 6 characters"
        value={props.password}
        onChange={props.onPasswordChange}
        icon={<LockOutlinedIcon sx={iconSx} />}
        disabled={props.loading}
        autoComplete="new-password"
        password={{ visible: props.showPassword, onToggle: props.onTogglePassword }}
      />
      <Button fullWidth variant="contained" onClick={props.onSubmit} disabled={props.loading} sx={authSubmitSx}>
        {props.loading ? <CircularProgress size={18} color="inherit" /> : "Sign Up"}
      </Button>
    </Stack>
  );
}
