import { Box, Typography, Card, CardContent, Button, Avatar, Chip, Stack, Divider } from "@mui/material";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import PaymentIcon from "@mui/icons-material/Payment";
import { useSelector } from "react-redux";

import { retrievePausedOrders } from "./selector";
import { getImageUrl } from "../../../lib/config";
import type { Order, OrderItem } from "../../../lib/types/order";
import { OrderStatus } from "../../../lib/enums/common.enum";
import OrderService from "../../services/OrderService";
import { useGlobals } from "../../hooks/useGlobals";

export function PausedOrders() {
  const pausedOrders = useSelector(retrievePausedOrders);
  const { setOrderBuilder } = useGlobals();

  const handleUpdateOrder = async (orderId: string, orderStatus: OrderStatus) => {
    try {
      const orderService = new OrderService();
      await orderService.updateOrder({ orderId, orderStatus });
      setOrderBuilder(new Date());
    } catch (err) {
      console.log("Error updating order:", err);
    }
  };

  if (pausedOrders.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            bgcolor: "#fef3c7",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <PauseCircleFilledIcon sx={{ fontSize: 36, color: "#d97706" }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.8, fontSize: "1.1rem" }}>
          No Pending Payment Orders
        </Typography>
        <Typography variant="body2" color="text.secondary">
          You have no unpaid or paused footwear orders.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
      {pausedOrders.map((order: Order) => (
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
              bgcolor: "#111827",
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
              <PauseCircleFilledIcon sx={{ color: "#f59e0b", fontSize: 22 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 800, fontSize: "0.95rem" }}>
                Order #{order._id?.slice(-6)?.toUpperCase()} &bull; Awaiting Payment
              </Typography>
            </Box>
            <Chip
              label="PENDING PAYMENT"
              size="small"
              sx={{ bgcolor: "#f59e0b", color: "#000000", fontWeight: 800, fontSize: "0.72rem" }}
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
                          {product?.productName || "KIXORA Footwear Model"}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#6b7280" }}>
                          Qty: {item.itemQuantity}x &bull; Unit Price: ${item.itemPrice?.toFixed(2)}
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
              <Button
                color="error"
                startIcon={<DeleteOutlinedIcon />}
                onClick={() => handleUpdateOrder(order._id, OrderStatus.DELETE)}
                sx={{ fontWeight: 700, textTransform: "none" }}
              >
                Cancel Order
              </Button>

              <Button
                variant="contained"
                startIcon={<PaymentIcon />}
                onClick={() => handleUpdateOrder(order._id, OrderStatus.PROCESS)}
                sx={{
                  bgcolor: "#111827",
                  color: "#ffffff",
                  borderRadius: "10px",
                  fontWeight: 800,
                  fontSize: "0.88rem",
                  px: 3,
                  py: 1,
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#000000", boxShadow: "none" },
                }}
              >
                Pay & Dispatch (${order.orderTotal?.toFixed(2)})
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
