import { useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Divider,
  Stack,
  Alert,
  CircularProgress,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import type { CartItem } from "../../../lib/types/cart";
import type { Member } from "../../../lib/types/member";
import { serverApi } from "../../../lib/config";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  member: Member | null;
  onConfirmOrder: (shippingInfo: any) => Promise<void>;
}

export function CheckoutModal({
  open,
  onClose,
  cartItems,
  member,
  onConfirmOrder,
}: CheckoutModalProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Step 1: Shipping Info
  const [fullName, setFullName] = useState(member?.memberNick || "");
  const [phone, setPhone] = useState(member?.memberPhone || "");
  const [address, setAddress] = useState(member?.memberAddress || "");
  const [city, setCity] = useState("Tashkent");
  const [postalCode, setPostalCode] = useState("100000");

  // Step 2: Payment Method
  const [paymentMethod, setPaymentMethod] = useState("CARD");
  const [cardNumber, setCardNumber] = useState("8600 •••• •••• 4589");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("•••");

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const isFreeShipping = subtotal >= 100;
  const shippingFee = subtotal > 0 && !isFreeShipping ? 10 : 0;
  const grandTotal = subtotal + shippingFee;

  const getImageSrc = (img?: string) => {
    if (!img) return "/sample.jpg";
    return img.startsWith("http") ? img : `${serverApi}/${img.replace("public/", "")}`;
  };

  const handleNext = () => {
    setErrorMsg("");
    if (activeStep === 0) {
      if (!fullName.trim() || !phone.trim() || !address.trim()) {
        setErrorMsg("Please fill in all required shipping address fields.");
        return;
      }
      setActiveStep(1);
    } else if (activeStep === 1) {
      setActiveStep(2);
    }
  };

  const handleBack = () => {
    setErrorMsg("");
    setActiveStep((prev) => Math.max(0, prev - 1));
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      await onConfirmOrder({
        fullName,
        phone,
        address: `${city}, ${address} (Zip: ${postalCode})`,
        paymentMethod,
      });
      setLoading(false);
      onClose();
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || "Failed to place order. Please try again.");
    }
  };

  const steps = ["Shipping", "Payment", "Review"];

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
        {/* Fixed Header */}
        <Box
          sx={{
            p: 2.2,
            px: 3.5,
            bgcolor: "#050505",
            color: "#ffffff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              component="img"
              src="/img/kixora/logo.png"
              alt="KIXORA"
              sx={{ height: 26, width: "auto", filter: "brightness(0) invert(1)" }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                fontSize: "1.1rem",
                fontFamily: '"Outfit", sans-serif',
                letterSpacing: "-0.01em",
                color: "#ffffff !important",
              }}
            >
              Luxury Checkout
            </Typography>
          </Box>

          <IconButton
            onClick={onClose}
            disabled={loading}
            size="small"
            sx={{ color: "#9ca3af", "&:hover": { color: "#ffffff", bgcolor: "rgba(255,255,255,0.1)" } }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Stepper Indicator */}
        <Box sx={{ px: 4, pt: 2.5, pb: 1.5, bgcolor: "#f9fafb", borderBottom: "1px solid #f3f4f6", flexShrink: 0 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
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

        {/* Scrollable Body Content */}
        <Box sx={{ p: { xs: 2.5, sm: 3.5 }, overflowY: "auto", flexGrow: 1 }}>
          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: "10px", fontSize: "0.82rem" }}>
              {errorMsg}
            </Alert>
          )}

          {/* STEP 1: SHIPPING ADDRESS */}
          {activeStep === 0 && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.5, fontSize: "1.05rem" }}>
                1. Shipping & Contact Information
              </Typography>
              <Typography variant="body2" sx={{ color: "#6b7280", mb: 2.5, fontSize: "0.82rem" }}>
                Enter your delivery address where our luxury footwear parcel will be delivered.
              </Typography>

              <Stack spacing={2}>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#374151", mb: 0.5, display: "block" }}>
                      Full Name *
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="e.g. Alexander McQueen"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", bgcolor: "#fcfcfd" } }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#374151", mb: 0.5, display: "block" }}>
                      Phone Number *
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="+998 90 123 45 67"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", bgcolor: "#fcfcfd" } }}
                    />
                  </Box>
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#374151", mb: 0.5, display: "block" }}>
                    Street Address & Apartment *
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Amir Temur Avenue 45, Apt 12"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", bgcolor: "#fcfcfd" } }}
                  />
                </Box>

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#374151", mb: 0.5, display: "block" }}>
                      City / Region
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", bgcolor: "#fcfcfd" } }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: "#374151", mb: 0.5, display: "block" }}>
                      Postal Code
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", bgcolor: "#fcfcfd" } }}
                    />
                  </Box>
                </Box>
              </Stack>
            </Box>
          )}

          {/* STEP 2: PAYMENT METHOD */}
          {activeStep === 1 && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.5, fontSize: "1.05rem" }}>
                2. Select Payment Method
              </Typography>
              <Typography variant="body2" sx={{ color: "#6b7280", mb: 2.5, fontSize: "0.82rem" }}>
                All transactions are encrypted with 256-bit SSL security.
              </Typography>

              <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <Stack spacing={1.5}>
                  {/* Card Option */}
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "12px",
                      border: paymentMethod === "CARD" ? "2px solid #111827" : "1px solid #e5e7eb",
                      bgcolor: paymentMethod === "CARD" ? "#fafafa" : "#ffffff",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    onClick={() => setPaymentMethod("CARD")}
                  >
                    <FormControlLabel
                      value="CARD"
                      control={<Radio size="small" sx={{ color: "#111827", "&.Mui-checked": { color: "#111827" } }} />}
                      label={
                        <Box sx={{ ml: 0.5 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: "0.88rem" }}>
                            Credit or Debit Card (Visa / Mastercard / UzCard / Humo)
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#6b7280" }}>
                            Instant confirmation & VIP insurance protection
                          </Typography>
                        </Box>
                      }
                    />
                    <CreditCardIcon sx={{ color: "#111827", fontSize: 24 }} />
                  </Box>

                  {/* Payme / Click Option */}
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "12px",
                      border: paymentMethod === "PAYME" ? "2px solid #111827" : "1px solid #e5e7eb",
                      bgcolor: paymentMethod === "PAYME" ? "#fafafa" : "#ffffff",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    onClick={() => setPaymentMethod("PAYME")}
                  >
                    <FormControlLabel
                      value="PAYME"
                      control={<Radio size="small" sx={{ color: "#111827", "&.Mui-checked": { color: "#111827" } }} />}
                      label={
                        <Box sx={{ ml: 0.5 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: "0.88rem" }}>
                            Payme / Click / Fast QR
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#6b7280" }}>
                            Direct app payment gateway
                          </Typography>
                        </Box>
                      }
                    />
                    <Typography variant="caption" sx={{ fontWeight: 800, color: "#00b2a9" }}>
                      PAYME / CLICK
                    </Typography>
                  </Box>

                  {/* Cash on Delivery */}
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: "12px",
                      border: paymentMethod === "COD" ? "2px solid #111827" : "1px solid #e5e7eb",
                      bgcolor: paymentMethod === "COD" ? "#fafafa" : "#ffffff",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    onClick={() => setPaymentMethod("COD")}
                  >
                    <FormControlLabel
                      value="COD"
                      control={<Radio size="small" sx={{ color: "#111827", "&.Mui-checked": { color: "#111827" } }} />}
                      label={
                        <Box sx={{ ml: 0.5 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: "0.88rem" }}>
                            Cash on Delivery (Courier Inspection)
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#6b7280" }}>
                            Try your shoes upon arrival and pay courier
                          </Typography>
                        </Box>
                      }
                    />
                    <LocalShippingOutlinedIcon sx={{ color: "#6b7280", fontSize: 24 }} />
                  </Box>
                </Stack>
              </RadioGroup>
            </Box>
          )}

          {/* STEP 3: REVIEW & SUMMARY */}
          {activeStep === 2 && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.5, fontSize: "1.05rem" }}>
                3. Review Your Luxury Order
              </Typography>
              <Typography variant="body2" sx={{ color: "#6b7280", mb: 2, fontSize: "0.82rem" }}>
                Please review your order details and shipping destination before placing.
              </Typography>

              {/* Items Summary list */}
              <Box
                sx={{
                  maxHeight: 140,
                  overflowY: "auto",
                  mb: 2.5,
                  p: 1.5,
                  borderRadius: "12px",
                  bgcolor: "#f9fafb",
                  border: "1px solid #f3f4f6",
                }}
              >
                {cartItems.map((item) => (
                  <Box
                    key={item._id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      py: 0.8,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar
                        src={getImageSrc(item.image)}
                        variant="rounded"
                        sx={{ width: 36, height: 36, borderRadius: "6px", border: "1px solid #e5e7eb" }}
                      />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: "#111827", fontSize: "0.85rem" }}>
                          {item.name}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mt: 0.3 }}>
                          {item.size ? (
                            <Chip
                              label={`EU ${item.size}`}
                              size="small"
                              sx={{
                                height: 18,
                                fontSize: "0.68rem",
                                fontWeight: 800,
                                bgcolor: "#111827",
                                color: "#ffffff",
                                borderRadius: "4px",
                              }}
                            />
                          ) : null}
                          <Typography variant="caption" sx={{ color: "#6b7280" }}>
                            Qty: {item.quantity} &bull; ${item.price} each
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 800, fontSize: "0.85rem" }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Delivery destination preview card */}
              <Box sx={{ p: 2, borderRadius: "12px", bgcolor: "#f9fafb", border: "1px solid #f3f4f6", mb: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#374151" }}>
                    Destination & Recipient:
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#a67c52", fontWeight: 700, cursor: "pointer" }} onClick={() => setActiveStep(0)}>
                    Edit
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "#111827", fontSize: "0.85rem" }}>
                  {fullName} ({phone})
                </Typography>
                <Typography variant="caption" sx={{ color: "#6b7280" }}>
                  {city}, {address} (Zip: {postalCode}) &bull; Method: {paymentMethod}
                </Typography>
              </Box>

              {/* Cost summary table */}
              <Stack spacing={0.8} sx={{ px: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" sx={{ color: "#6b7280", fontSize: "0.82rem" }}>
                    Subtotal ({cartItems.length} items)
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    ${subtotal.toFixed(2)}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" sx={{ color: "#6b7280", fontSize: "0.82rem" }}>
                    Express Delivery (KIXORA White Glove)
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: isFreeShipping ? "#16a34a" : "#111827" }}>
                    {isFreeShipping ? "FREE" : `$${shippingFee.toFixed(2)}`}
                  </Typography>
                </Box>

                <Divider sx={{ my: 0.5 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 900, color: "#111827" }}>
                    Total Amount
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 900, color: "#111827", fontSize: "1.2rem" }}>
                    ${grandTotal.toFixed(2)}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          )}
        </Box>

        {/* Footer Navigation Buttons */}
        <Box
          sx={{
            p: 2.5,
            px: 4,
            bgcolor: "#f9fafb",
            borderTop: "1px solid #f3f4f6",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {activeStep > 0 ? (
            <Button
              variant="text"
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              disabled={loading}
              sx={{ color: "#6b7280", fontWeight: 700, textTransform: "none" }}
            >
              Back
            </Button>
          ) : (
            <Button
              variant="text"
              onClick={onClose}
              disabled={loading}
              sx={{ color: "#6b7280", fontWeight: 600, textTransform: "none" }}
            >
              Cancel
            </Button>
          )}

          {activeStep < 2 ? (
            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={handleNext}
              sx={{
                bgcolor: "#111827",
                color: "#ffffff",
                borderRadius: "10px",
                fontWeight: 800,
                fontSize: "0.88rem",
                px: 3.5,
                py: 1,
                textTransform: "none",
                boxShadow: "none",
                "&:hover": { bgcolor: "#000000", boxShadow: "none" },
              }}
            >
              Continue to {steps[activeStep + 1]}
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<LockOutlinedIcon />}
              onClick={handlePlaceOrder}
              disabled={loading}
              sx={{
                bgcolor: "#111827",
                color: "#ffffff",
                borderRadius: "10px",
                fontWeight: 800,
                fontSize: "0.92rem",
                px: 4,
                py: 1.1,
                textTransform: "none",
                boxShadow: "none",
                "&:hover": { bgcolor: "#000000", boxShadow: "none" },
              }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : `Place Order ($${grandTotal.toFixed(2)})`}
            </Button>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
