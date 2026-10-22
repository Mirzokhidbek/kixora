import { Alert, Box, CircularProgress, FormControlLabel, Radio, RadioGroup, Stack, Typography } from "@mui/material";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import type { PaymentConfig, PaymentMethod } from "../../services/PaymentService";
import { optionCardSx, stepSubtitleSx, stepTitleSx } from "./checkoutStyles";

const OPTIONS: Record<PaymentMethod, { title: string; caption: string; icon: React.ReactNode }> = {
  TEST: {
    title: "Test payment (demo)",
    caption: "Simulated payment for testing. No card is charged and no money moves.",
    icon: <ScienceOutlinedIcon sx={{ color: "#7c3aed", fontSize: 24 }} />,
  },
  MANUAL: {
    title: "Pay on delivery / bank transfer",
    caption: "Your order is reserved. The store confirms it once your payment is received.",
    icon: <LocalShippingOutlinedIcon sx={{ color: "#6b7280", fontSize: 24 }} />,
  },
};

interface PaymentStepProps {
  config: PaymentConfig | null;
  value: PaymentMethod | null;
  onChange: (method: PaymentMethod) => void;
}

/**
 * Step 2: payment method, as offered by the server.
 * (Replaces the old form that showed a prefilled fake card number and
 * card/Payme options that were never connected to anything.)
 */
export function PaymentStep({ config, value, onChange }: PaymentStepProps) {
  if (!config) {
    return (
      <Box sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress size={24} sx={{ color: "#111827" }} />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle1" sx={stepTitleSx}>
        2. Select Payment Method
      </Typography>
      <Typography variant="body2" sx={stepSubtitleSx}>
        Online card payments are not available yet.
      </Typography>

      {config.mode === "test" && (
        <Alert severity="info" sx={{ mb: 2, borderRadius: "10px", fontSize: "0.8rem" }}>
          The store is in test mode: payments are simulated.
        </Alert>
      )}

      <RadioGroup value={value ?? ""} onChange={(e) => onChange(e.target.value as PaymentMethod)}>
        <Stack spacing={1.5}>
          {config.methods.map((method) => (
            <Box key={method} sx={optionCardSx(value === method)} onClick={() => onChange(method)}>
              <FormControlLabel
                value={method}
                control={<Radio size="small" sx={{ color: "#111827", "&.Mui-checked": { color: "#111827" } }} />}
                label={
                  <Box sx={{ ml: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: "0.88rem" }}>
                      {OPTIONS[method].title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#6b7280" }}>
                      {OPTIONS[method].caption}
                    </Typography>
                  </Box>
                }
              />
              {OPTIONS[method].icon}
            </Box>
          ))}
        </Stack>
      </RadioGroup>
    </Box>
  );
}

export const paymentMethodLabel = (method: PaymentMethod | null) => (method ? OPTIONS[method].title : "");
