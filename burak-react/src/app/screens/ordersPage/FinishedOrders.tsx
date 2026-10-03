import { Box, Typography, Card, CardContent, Avatar, Chip, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { useSelector } from "react-redux";

import { retrieveFinishedOrders } from "./selector";
import { serverApi } from "../../../lib/config";
import type { Order, OrderItem } from "../../../lib/types/order";

export function FinishedOrders() {
  const finishedOrders = useSelector(retrieveFinishedOrders);

  const getImageSrc = (img?: string) => {
    if (!img) return "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=150&q=80";
    return img.startsWith("http") ? img : `${serverApi}/${img}`;
  };

  if (finishedOrders.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <CheckCircleIcon sx={{ fontSize: 60, color: "#94a3b8", mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          No Completed Orders Yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Completed orders and receipts will appear here once delivered.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {finishedOrders.map((order: Order) => (
        <Card
          key={order._id}
          sx={{
            borderRadius: 4,
            border: "1px solid #e2e8f0",
            overflow: "hidden",
            boxShadow: "0 4px 16px rgba(15, 23, 42, 0.05)",
          }}
        >
          <Box
            sx={{
              bgcolor: "#064e3b",
              color: "#fff",
              px: 3,
              py: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <CheckCircleIcon sx={{ color: "#34d399" }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                Order #{order._id?.slice(-6)?.toUpperCase()}
              </Typography>
            </Box>
            <Chip label="DELIVERED &bull; COMPLETED" size="small" sx={{ bgcolor: "#34d399", color: "#064e3b", fontWeight: 800 }} />
          </Box>

          <CardContent sx={{ p: 3 }}>
            {order.orderItems?.map((item: OrderItem, idx: number) => {
              const product = order.productData?.[idx];
              return (
                <Box
                  key={item._id || idx}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    bgcolor: "#f8fafc",
                    p: 1.5,
                    borderRadius: 3,
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar src={getImageSrc(product?.productImages?.[0])} variant="rounded" sx={{ width: 52, height: 52, borderRadius: 2 }} />
                    <div>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        {product?.productName || "Gourmet Ottoman Recipe"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Qty: {item.itemQuantity}x &bull; Delivered
                      </Typography>
                    </div>
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0f172a" }}>
                    ${((item.itemPrice || 0) * (item.itemQuantity || 1)).toFixed(2)}
                  </Typography>
                </Box>
              );
            })}

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pt: 2, borderTop: "1px solid #f1f5f9", flexWrap: "wrap", gap: 2 }}>
              <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600 }}>
                Delivered & Bonus +10 VIP Points Claimed
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
                  Total: ${order.orderTotal?.toFixed(2)}
                </Typography>
                <Button variant="outlined" size="small" startIcon={<ReceiptIcon />} sx={{ borderRadius: 2 }}>
                  Download E-Receipt
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
