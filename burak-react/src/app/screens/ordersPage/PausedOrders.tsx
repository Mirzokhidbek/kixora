import { Box, Typography, Card, CardContent, Button, Avatar, Chip } from "@mui/material";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";
import DeleteIcon from "@mui/icons-material/Delete";
import PaymentIcon from "@mui/icons-material/Payment";
import { useSelector } from "react-redux";

import { retrievePausedOrders } from "./selector";
import { serverApi } from "../../../lib/config";
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

  const getImageSrc = (img?: string) => {
    if (!img) return "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=150&q=80";
    return img.startsWith("http") ? img : `${serverApi}/${img}`;
  };

  if (pausedOrders.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <PauseCircleFilledIcon sx={{ fontSize: 60, color: "#94a3b8", mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          No Paused Orders
        </Typography>
        <Typography variant="body2" color="text.secondary">
          You don't have any unpaid or paused dining orders at the moment.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {pausedOrders.map((order: Order) => (
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
              bgcolor: "#1e293b",
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
              <PauseCircleFilledIcon sx={{ color: "#f59e0b" }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                Order #{order._id?.slice(-6)?.toUpperCase()}
              </Typography>
            </Box>
            <Chip label="PAUSED / UNPAID" size="small" sx={{ bgcolor: "#f59e0b", color: "#000", fontWeight: 800 }} />
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
                        {product?.productName || "Delicious Burak Specialty"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Qty: {item.itemQuantity}x &bull; Unit: ${item.itemPrice?.toFixed(2)}
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
              <Button
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleUpdateOrder(order._id, OrderStatus.DELETE)}
              >
                Cancel Order
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<PaymentIcon />}
                onClick={() => handleUpdateOrder(order._id, OrderStatus.PROCESS)}
                sx={{ fontWeight: 800, px: 3, borderRadius: 3 }}
              >
                Pay & Cook (${order.orderTotal?.toFixed(2)})
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
