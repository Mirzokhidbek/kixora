import { Box, Typography, Card, CardContent, Button, Avatar, Chip, LinearProgress } from "@mui/material";
import OutdoorGrillIcon from "@mui/icons-material/OutdoorGrill";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useSelector } from "react-redux";

import { retrieveProcessOrders } from "./selector";
import { serverApi } from "../../../lib/config";
import type { Order, OrderItem } from "../../../lib/types/order";
import { OrderStatus } from "../../../lib/enums/common.enum";
import OrderService from "../../services/OrderService";
import { useGlobals } from "../../hooks/useGlobals";

export function ProcessOrders() {
  const processOrders = useSelector(retrieveProcessOrders);
  const { setOrderBuilder } = useGlobals();

  const handleUpdateOrder = async (orderId: string, orderStatus: OrderStatus) => {
    try {
      const orderService = new OrderService();
      await orderService.updateOrder({ orderId, orderStatus });
      setOrderBuilder(new Date());
    } catch (err) {
      console.log("Error finishing order:", err);
    }
  };

  const getImageSrc = (img?: string) => {
    if (!img) return "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=150&q=80";
    return img.startsWith("http") ? img : `${serverApi}/${img}`;
  };

  if (processOrders.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <OutdoorGrillIcon sx={{ fontSize: 60, color: "#94a3b8", mb: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          No Active Cooking Orders
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No orders are currently being prepared in our open-fire kitchen.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {processOrders.map((order: Order) => (
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
              bgcolor: "#0f172a",
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
              <OutdoorGrillIcon sx={{ color: "#38bdf8" }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                Order #{order._id?.slice(-6)?.toUpperCase()}
              </Typography>
            </Box>
            <Chip
              label="COOKING ON EMBERS &bull; EN ROUTE"
              size="small"
              sx={{ bgcolor: "#38bdf8", color: "#000", fontWeight: 800 }}
            />
          </Box>

          {/* Progress bar */}
          <LinearProgress
            variant="indeterminate"
            sx={{
              height: 4,
              bgcolor: "rgba(56, 189, 248, 0.2)",
              "& .MuiLinearProgress-bar": { bgcolor: "#38bdf8" },
            }}
          />

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
                        {product?.productName || "Chef Signature Selection"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Qty: {item.itemQuantity}x &bull; Freshly Crafted
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
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0f172a" }}>
                Total Paid: ${order.orderTotal?.toFixed(2)}
              </Typography>

              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={() => handleUpdateOrder(order._id, OrderStatus.FINISH)}
                sx={{ fontWeight: 800, px: 3, borderRadius: 3 }}
              >
                Confirm Delivery (+10 Pts)
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
