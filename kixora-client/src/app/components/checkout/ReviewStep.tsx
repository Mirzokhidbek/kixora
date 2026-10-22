import { Avatar, Box, Chip, Divider, Stack, Typography } from "@mui/material";
import type { CartItem } from "../../../lib/types/cart";
import { getImageUrl } from "../../../lib/config";
import { stepTitleSx } from "./checkoutStyles";

interface ReviewStepProps {
  cartItems: CartItem[];
  recipientLine: string;
  addressLine: string;
  paymentLabel: string;
  totals: { subtotal: number; delivery: number; total: number };
  onEditShipping: () => void;
}

/** Step 3: order summary. The final amount is recalculated by the server from catalog prices. */
export function ReviewStep({ cartItems, recipientLine, addressLine, paymentLabel, totals, onEditShipping }: ReviewStepProps) {
  return (
    <Box>
      <Typography variant="subtitle1" sx={stepTitleSx}>
        3. Review Your Order
      </Typography>
      <Typography variant="body2" sx={{ color: "#6b7280", mb: 2, fontSize: "0.82rem" }}>
        Please check your items and delivery address before placing the order.
      </Typography>

      <Box sx={{ maxHeight: 140, overflowY: "auto", mb: 2.5, p: 1.5, borderRadius: "12px", bgcolor: "#f9fafb", border: "1px solid #f3f4f6" }}>
        {cartItems.map((item) => (
          <Box key={item.cartItemId || `${item._id}-${item.size ?? ""}`} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 0.8 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar src={getImageUrl(item.image)} variant="rounded" sx={{ width: 36, height: 36, borderRadius: "6px", border: "1px solid #e5e7eb" }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 800, color: "#111827", fontSize: "0.85rem" }}>
                  {item.name}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mt: 0.3 }}>
                  {item.size ? (
                    <Chip
                      label={`EU ${item.size}`}
                      size="small"
                      sx={{ height: 18, fontSize: "0.68rem", fontWeight: 800, bgcolor: "#111827", color: "#ffffff", borderRadius: "4px" }}
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

      <Box sx={{ p: 2, borderRadius: "12px", bgcolor: "#f9fafb", border: "1px solid #f3f4f6", mb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, color: "#374151" }}>
            Destination & Recipient:
          </Typography>
          <Typography variant="caption" sx={{ color: "#a67c52", fontWeight: 700, cursor: "pointer" }} onClick={onEditShipping}>
            Edit
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 700, color: "#111827", fontSize: "0.85rem" }}>
          {recipientLine}
        </Typography>
        <Typography variant="caption" sx={{ color: "#6b7280" }}>
          {addressLine} &bull; {paymentLabel}
        </Typography>
      </Box>

      <Stack spacing={0.8} sx={{ px: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2" sx={{ color: "#6b7280", fontSize: "0.82rem" }}>
            Subtotal ({cartItems.length} items)
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            ${totals.subtotal.toFixed(2)}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2" sx={{ color: "#6b7280", fontSize: "0.82rem" }}>
            Delivery
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, color: totals.delivery === 0 ? "#16a34a" : "#111827" }}>
            {totals.delivery === 0 ? "FREE" : `$${totals.delivery.toFixed(2)}`}
          </Typography>
        </Box>
        <Divider sx={{ my: 0.5 }} />
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 900, color: "#111827" }}>
            Total Amount
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 900, color: "#111827", fontSize: "1.2rem" }}>
            ${totals.total.toFixed(2)}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
