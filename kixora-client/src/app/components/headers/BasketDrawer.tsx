import { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Avatar,
  Divider,
  TextField,
  InputAdornment,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import type { CartItem } from "../../../lib/types/cart";
import { getImageUrl } from "../../../lib/config";

interface BasketDrawerProps {
  open: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onAdd: (item: any, quantity?: number, size?: number, color?: string) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
  onCheckout: () => void;
}

export function BasketDrawer({
  open,
  onClose,
  cartItems,
  onAdd,
  onRemove,
  onDelete,
  onDeleteAll,
  onCheckout,
}: BasketDrawerProps) {
  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoMsg, setPromoMsg] = useState("");

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const freeShippingThreshold = 100;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingFee = subtotal > 0 && !isFreeShipping ? 10 : 0;
  const discountAmount = (subtotal * appliedDiscount) / 100;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);


  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === "KIXORA10") {
      setAppliedDiscount(10);
      setPromoMsg("10% KIXORA VIP discount applied!");
    } else if (promoCode.trim().toUpperCase() === "FREESHIP") {
      setAppliedDiscount(5);
      setPromoMsg("Promo code applied!");
    } else {
      setPromoMsg("Invalid promo code");
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", sm: 420 },
            bgcolor: "#ffffff",
            color: "#111827",
            display: "flex",
            flexDirection: "column",
            boxShadow: "-10px 0 30px rgba(0, 0, 0, 0.08)",
          },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2.5,
          px: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <ShoppingBagOutlinedIcon sx={{ color: "#000000" }} />
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: "1.1rem" }}>
            Your Bag ({cartItems.length})
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "#6b7280", "&:hover": { color: "#000000" } }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Free Shipping Progress Indicator */}
      {cartItems.length > 0 && (
        <Box sx={{ px: 3, py: 1.5, bgcolor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <LocalShippingOutlinedIcon sx={{ fontSize: 18, color: isFreeShipping ? "#10b981" : "#000000" }} />
            <Typography variant="caption" sx={{ fontWeight: 700, color: "#374151" }}>
              {isFreeShipping
                ? "You've unlocked FREE Express Shipping!"
                : `Add $${(freeShippingThreshold - subtotal).toFixed(2)} more to qualify for Free Shipping`}
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              height: 4,
              bgcolor: "#e5e7eb",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`,
                height: "100%",
                bgcolor: isFreeShipping ? "#10b981" : "#000000",
                transition: "width 0.3s ease",
              }}
            />
          </Box>
        </Box>
      )}

      {/* Cart Items List */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 3 }}>
        {cartItems.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                bgcolor: "#f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <ShoppingBagOutlinedIcon sx={{ fontSize: 36, color: "#9ca3af" }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: "#111827" }}>
              Your bag is empty
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 240, mx: "auto" }}>
              Discover our latest sneaker drops and add your favorite pairs.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {cartItems.map((item) => (
              <Box
                key={item._id}
                sx={{
                  display: "flex",
                  gap: 2,
                  bgcolor: "#ffffff",
                  p: 2,
                  borderRadius: 3,
                  border: "1px solid #e5e7eb",
                  transition: "box-shadow 0.2s",
                  "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.04)" },
                }}
              >
                <Avatar
                  src={getImageUrl(item.image)}
                  variant="rounded"
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: 2.5,
                    bgcolor: "#f3f4f6",
                    border: "1px solid #e5e7eb",
                    "& img": { objectFit: "contain", p: 0.5 },
                  }}
                />

                <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#111827", lineHeight: 1.3 }}>
                        {item.name}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => onDelete(item)}
                        sx={{ color: "#9ca3af", p: 0.5, "&:hover": { color: "#ef4444" } }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Box sx={{ display: "flex", gap: 0.8, alignItems: "center", mt: 0.5, flexWrap: "wrap" }}>
                      {item.size ? (
                        <Chip
                          label={`EU ${item.size}`}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: "0.7rem",
                            fontWeight: 800,
                            bgcolor: "#111827",
                            color: "#ffffff",
                            borderRadius: "6px",
                          }}
                        />
                      ) : null}
                      {item.color && item.color !== "Standard" ? (
                        <Chip
                          label={item.color}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            bgcolor: "#f3f4f6",
                            color: "#374151",
                            borderRadius: "6px",
                          }}
                        />
                      ) : null}
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1.5 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: "0.95rem", color: "#111827" }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>

                    {/* Stepper */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        bgcolor: "#f9fafb",
                        border: "1px solid #e5e7eb",
                        borderRadius: 9999,
                        px: 0.5,
                      }}
                    >
                      <IconButton size="small" onClick={() => onRemove(item)} sx={{ color: "#374151", p: 0.4 }}>
                        <RemoveIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                      <Typography sx={{ px: 1.2, fontWeight: 700, fontSize: "0.85rem", color: "#111827" }}>
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() =>
                          onAdd(
                            {
                              _id: item._id,
                              productName: item.name,
                              productPrice: item.price,
                              productImages: [item.image],
                            } as any,
                            1,
                            item.size,
                            item.color
                          )
                        }
                        sx={{ color: "#374151", p: 0.4 }}
                      >
                        <AddIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}

            <Button
              size="small"
              onClick={onDeleteAll}
              sx={{
                alignSelf: "flex-end",
                textTransform: "none",
                fontSize: "0.8rem",
                color: "#6b7280",
                "&:hover": { color: "#ef4444" },
              }}
            >
              Clear Bag
            </Button>
          </Box>
        )}
      </Box>

      {/* Footer & Checkout */}
      {cartItems.length > 0 && (
        <Box sx={{ p: 3, borderTop: "1px solid #e5e7eb", bgcolor: "#f9fafb" }}>
          {/* Promo Code Input */}
          <Box sx={{ mb: 2.5 }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="Promo Code (e.g. KIXORA10)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                sx={{
                  bgcolor: "#ffffff",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    fontSize: "0.85rem",
                  },
                }}
              />
              <Button
                variant="outlined"
                onClick={handleApplyPromo}
                sx={{
                  borderColor: "#000000",
                  color: "#000000",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  borderRadius: 2,
                  px: 2,
                  "&:hover": { bgcolor: "#000000", color: "#ffffff", borderColor: "#000000" },
                }}
              >
                Apply
              </Button>
            </Box>
            {promoMsg && (
              <Typography
                variant="caption"
                sx={{
                  mt: 0.5,
                  display: "block",
                  color: appliedDiscount > 0 ? "#10b981" : "#ef4444",
                  fontWeight: 600,
                }}
              >
                {promoMsg}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" sx={{ color: "#6b7280" }}>
              Subtotal:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "#111827" }}>
              ${subtotal.toFixed(2)}
            </Typography>
          </Box>

          {appliedDiscount > 0 && (
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body2" sx={{ color: "#10b981" }}>
                VIP Discount ({appliedDiscount}%):
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: "#10b981" }}>
                -${discountAmount.toFixed(2)}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
            <Typography variant="body2" sx={{ color: "#6b7280" }}>
              Shipping:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: isFreeShipping ? "#10b981" : "#111827" }}>
              {isFreeShipping ? "FREE" : `$${shippingFee.toFixed(2)}`}
            </Typography>
          </Box>

          <Divider sx={{ my: 1.5 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#111827" }}>
              Total:
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 900, color: "#000000" }}>
              ${grandTotal.toFixed(2)}
            </Typography>
          </Box>

          <Button
            variant="contained"
            fullWidth
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={onCheckout}
            sx={{
              py: 1.5,
              borderRadius: 9999,
              fontWeight: 800,
              fontSize: "0.95rem",
              bgcolor: "#000000",
              color: "#ffffff",
              textTransform: "none",
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#262626",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
              },
            }}
          >
            Proceed to Checkout
          </Button>
        </Box>
      )}
    </Drawer>
  );
}
