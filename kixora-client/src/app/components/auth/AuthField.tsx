import { Box, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    bgcolor: "#fcfcfd",
    fontSize: "0.82rem",
    "& fieldset": { borderColor: "#e5e7eb" },
    "&:hover fieldset": { borderColor: "#d1d5db" },
    "&.Mui-focused fieldset": { borderColor: "#111827" },
  },
  "& .MuiInputBase-input": { py: 0.8 },
} as const;

interface AuthFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  /** Renders a password input with a show/hide toggle */
  password?: { visible: boolean; onToggle: () => void };
}

/** Labeled input used by the login and signup forms */
export function AuthField({ label, value, onChange, icon, placeholder, disabled, autoFocus, autoComplete, password }: AuthFieldProps) {
  return (
    <Box>
      <Typography variant="caption" sx={{ fontWeight: 600, color: "#374151", mb: 0.3, display: "block", fontSize: "0.76rem" }}>
        {label}
      </Typography>
      <TextField
        fullWidth
        size="small"
        type={password && !password.visible ? "password" : "text"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        autoFocus={autoFocus}
        sx={fieldSx}
        slotProps={{
          htmlInput: { autoComplete },
          input: {
            startAdornment: <InputAdornment position="start">{icon}</InputAdornment>,
            endAdornment: password ? (
              <InputAdornment position="end">
                <IconButton
                  onClick={password.onToggle}
                  edge="end"
                  size="small"
                  aria-label={password.visible ? "Hide password" : "Show password"}
                  sx={{ color: "#9ca3af", p: 0.4 }}
                >
                  {password.visible ? <VisibilityOffOutlinedIcon sx={{ fontSize: 16 }} /> : <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />}
                </IconButton>
              </InputAdornment>
            ) : undefined,
          },
        }}
      />
    </Box>
  );
}
