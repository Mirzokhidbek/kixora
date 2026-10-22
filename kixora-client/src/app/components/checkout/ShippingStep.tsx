import { Box, Stack, TextField, Typography } from "@mui/material";
import { fieldLabelSx, inputSx, stepSubtitleSx, stepTitleSx } from "./checkoutStyles";
import type { ShippingForm } from "./shipping";

interface ShippingStepProps {
  value: ShippingForm;
  onChange: (next: ShippingForm) => void;
}

/** Step 1: delivery address. Sent with the order and shown to the store admin. */
export function ShippingStep({ value, onChange }: ShippingStepProps) {
  const field = (key: keyof ShippingForm, label: string, placeholder = "", multiline = false) => (
    <Box>
      <Typography variant="caption" sx={fieldLabelSx}>
        {label}
      </Typography>
      <TextField
        fullWidth
        size="small"
        placeholder={placeholder}
        multiline={multiline}
        minRows={multiline ? 2 : undefined}
        value={value[key]}
        onChange={(e) => onChange({ ...value, [key]: e.target.value })}
        sx={inputSx}
      />
    </Box>
  );

  return (
    <Box>
      <Typography variant="subtitle1" sx={stepTitleSx}>
        1. Shipping & Contact Information
      </Typography>
      <Typography variant="body2" sx={stepSubtitleSx}>
        Enter the delivery address for your order.
      </Typography>

      <Stack spacing={2}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
          {field("fullName", "Full Name *", "e.g. Aziz Karimov")}
          {field("phone", "Phone Number *", "+998 90 123 45 67")}
        </Box>
        {field("address", "Street Address & Apartment *", "Amir Temur Avenue 45, Apt 12")}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
          {field("city", "City / Region *", "Tashkent")}
          {field("postalCode", "Postal Code", "100000")}
        </Box>
        {field("note", "Courier Note (optional)", "e.g. Call before arriving", true)}
      </Stack>
    </Box>
  );
}
