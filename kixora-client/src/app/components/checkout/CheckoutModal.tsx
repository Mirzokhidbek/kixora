/**
 * CheckoutModal - 3-step checkout (shipping → payment → review).
 * Shipping details and chosen sizes are sent with the order; the payment is
 * confirmed by the server (test provider or store admin), never by the client.
 */
import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import type { CartItem } from "../../../lib/types/cart";
import type { Member } from "../../../lib/types/member";
import type { ShippingInfo } from "../../../lib/types/order";
import { calculateCartTotals } from "../../../lib/pricing";
import PaymentService, { type PaymentConfig, type PaymentMethod } from "../../services/PaymentService";
import { ShippingStep } from "./ShippingStep";
import { formatAddress, validateShipping, type ShippingForm } from "./shipping";
import { PaymentStep } from "./PaymentStep";
import { paymentMethodLabel } from "./payment";
import { ReviewStep } from "./ReviewStep";
import { primaryButtonSx } from "./checkoutStyles";

export interface CheckoutRequest {
  shipping: ShippingInfo;
  paymentMethod: PaymentMethod;
}

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  member: Member | null;
  onConfirmOrder: (request: CheckoutRequest) => Promise<void>;
}

const STEPS = ["Shipping", "Payment", "Review"];
const paymentService = new PaymentService();

export function CheckoutModal({ open, onClose, cartItems, member, onConfirmOrder }: CheckoutModalProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [shipping, setShipping] = useState<ShippingForm>({
    fullName: member?.memberNick || "",
    phone: member?.memberPhone || "",
    address: member?.memberAddress || "",
    city: "",
    postalCode: "",
    note: "",
  });
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

  useEffect(() => {
    if (!open || paymentConfig) return;
    paymentService
      .getConfig()
      .then((config) => {
        setPaymentConfig(config);
        setPaymentMethod((current) => current ?? config.methods[0] ?? null);
      })
      .catch(() => setErrorMsg("Could not load payment options. Please try again."));
  }, [open, paymentConfig]);

  const totals = calculateCartTotals(cartItems);

  const handleNext = () => {
    setErrorMsg("");
    if (activeStep === 0) {
      const error = validateShipping(shipping);
      if (error) return setErrorMsg(error);
    }
    if (activeStep === 1 && !paymentMethod) {
      return setErrorMsg("Please choose a payment method.");
    }
    setActiveStep((s) => Math.min(2, s + 1));
  };

  const handleBack = () => {
    setErrorMsg("");
    setActiveStep((s) => Math.max(0, s - 1));
  };

  const handlePlaceOrder = async () => {
    if (!paymentMethod) return;
    setLoading(true);
    setErrorMsg("");
    try {
      await onConfirmOrder({
        paymentMethod,
        shipping: {
          recipient: shipping.fullName.trim(),
          phone: shipping.phone.trim(),
          address: formatAddress(shipping),
          note: shipping.note.trim() || undefined,
        },
      });
      setActiveStep(0);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
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
            borderRadius: "18px",
            bgcolor: "#ffffff",
            color: "#111827",
            overflow: "hidden",
            boxShadow: "0 30px 90px rgba(0, 0, 0, 0.35)",
            maxWidth: 760,
            maxHeight: "92vh",
            display: "flex",
            flexDirection: "column",
            m: { xs: 1, sm: 2 },
          },
        },
      }}
    >
      <DialogContent sx={{ p: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <Box sx={{ p: 2.2, px: 3.5, bgcolor: "#050505", color: "#ffffff", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box component="img" src="/img/kixora/logo.png" alt="KIXORA" sx={{ height: 26, width: "auto", filter: "brightness(0) invert(1)" }} />
            <Typography variant="h6" sx={{ fontWeight: 900, fontSize: "1.1rem", fontFamily: '"Outfit", sans-serif', letterSpacing: "-0.01em", color: "#ffffff !important" }}>
              Checkout
            </Typography>
          </Box>
          <IconButton onClick={onClose} disabled={loading} size="small" sx={{ color: "#9ca3af", "&:hover": { color: "#ffffff", bgcolor: "rgba(255,255,255,0.1)" } }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Stepper */}
        <Box sx={{ px: 4, pt: 2.5, pb: 1.5, bgcolor: "#f9fafb", borderBottom: "1px solid #f3f4f6", flexShrink: 0 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel
                  sx={{
                    "& .MuiStepLabel-label": {
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "#6b7280",
                      "&.Mui-active": { color: "#111827", fontWeight: 800 },
                      "&.Mui-completed": { color: "#16a34a" },
                    },
                    "& .MuiStepIcon-root": {
                      fontSize: 22,
                      color: "#e5e7eb",
                      "&.Mui-active": { color: "#111827" },
                      "&.Mui-completed": { color: "#16a34a" },
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Body */}
        <Box sx={{ p: { xs: 2.5, sm: 3.5 }, overflowY: "auto", flexGrow: 1 }}>
          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: "10px", fontSize: "0.82rem" }}>
              {errorMsg}
            </Alert>
          )}
          {activeStep === 0 && <ShippingStep value={shipping} onChange={setShipping} />}
          {activeStep === 1 && <PaymentStep config={paymentConfig} value={paymentMethod} onChange={setPaymentMethod} />}
          {activeStep === 2 && (
            <ReviewStep
              cartItems={cartItems}
              recipientLine={`${shipping.fullName} (${shipping.phone})`}
              addressLine={formatAddress(shipping)}
              paymentLabel={paymentMethodLabel(paymentMethod)}
              totals={totals}
              onEditShipping={() => setActiveStep(0)}
            />
          )}
        </Box>

        {/* Footer */}
        <Box sx={{ p: 2.5, px: 4, bgcolor: "#f9fafb", borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Button
            variant="text"
            startIcon={activeStep > 0 ? <ArrowBackIcon /> : undefined}
            onClick={activeStep > 0 ? handleBack : onClose}
            disabled={loading}
            sx={{ color: "#6b7280", fontWeight: 700, textTransform: "none" }}
          >
            {activeStep > 0 ? "Back" : "Cancel"}
          </Button>

          {activeStep < 2 ? (
            <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={handleNext} sx={primaryButtonSx}>
              Continue to {STEPS[activeStep + 1]}
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<LockOutlinedIcon />}
              onClick={handlePlaceOrder}
              disabled={loading}
              sx={{ ...primaryButtonSx, fontSize: "0.92rem", px: 4, py: 1.1 }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : `Place Order ($${totals.total.toFixed(2)})`}
            </Button>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
