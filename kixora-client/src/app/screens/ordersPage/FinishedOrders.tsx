import { Box, Typography, Card, CardContent, Avatar, Chip, Button, Stack, Divider } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import { useSelector } from "react-redux";

import { retrieveFinishedOrders } from "./selector";
import { getImageUrl } from "../../../lib/config";
import type { Order, OrderItem } from "../../../lib/types/order";

export function FinishedOrders() {
  const finishedOrders = useSelector(retrieveFinishedOrders);

  if (finishedOrders.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            bgcolor: "#ecfdf5",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 36, color: "#10b981" }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.8, fontSize: "1.1rem" }}>
          No Completed Orders Yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Delivered footwear shipments and official electronic invoices will appear here.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
      {finishedOrders.map((order: Order) => (
        <Card
          key={order._id}
          sx={{
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
            overflow: "hidden",
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.04)",
          }}
        >
          <Box
            sx={{
              bgcolor: "#064e3b",
              color: "#ffffff",
              px: 3.5,
              py: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <VerifiedOutlinedIcon sx={{ color: "#34d399", fontSize: 22 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 800, fontSize: "0.95rem" }}>
                Delivered Order #{order._id?.slice(-6)?.toUpperCase()}
              </Typography>
            </Box>
            <Chip
              label="DELIVERED & VERIFIED"
              size="small"
              sx={{ bgcolor: "#34d399", color: "#064e3b", fontWeight: 800, fontSize: "0.72rem" }}
            />
          </Box>

          <CardContent sx={{ p: 3.5 }}>
            <Stack spacing={1.5} sx={{ mb: 2.5 }}>
              {order.orderItems?.map((item: OrderItem, idx: number) => {
                const product = order.productData?.[idx];
                return (
                  <Box
                    key={item._id || idx}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      bgcolor: "#f9fafb",
                      p: 1.8,
                      borderRadius: "12px",
                      border: "1px solid #f3f4f6",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        src={getImageUrl(product?.productImages?.[0])}
                        variant="rounded"
                        sx={{
                          width: 52,
                          height: 52,
                          borderRadius: "10px",
                          border: "1px solid #e5e7eb",
                          bgcolor: "#ffffff",
                        }}
                      />
                      <div>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: "#111827" }}>
                          {product?.productName || "KIXORA Signature Footwear"}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#6b7280" }}>
                          Qty: {item.itemQuantity}x &bull; EU {product?.productSizes?.[0] || 42} &bull; Delivered
                        </Typography>
                      </div>
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900, color: "#111827" }}>
                      ${((item.itemPrice || 0) * (item.itemQuantity || 1)).toFixed(2)}
                    </Typography>
                  </Box>
                );
              })}
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600, fontSize: "0.84rem" }}>
                Delivered &bull; Authenticity Certificate Included &bull; +10 VIP Points Claimed
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 900, color: "#111827" }}>
                  Total: ${order.orderTotal?.toFixed(2)}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ReceiptLongIcon />}
                  sx={{
                    borderRadius: "8px",
                    borderColor: "#e5e7eb",
                    color: "#111827",
                    fontWeight: 700,
                    textTransform: "none",
                    "&:hover": { borderColor: "#111827", bgcolor: "#f9fafb" },
                  }}
                >
                  Download E-Invoice
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
