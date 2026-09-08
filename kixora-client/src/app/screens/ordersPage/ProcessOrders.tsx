import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Stack,
  Divider,
} from "@mui/material";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import VerifiedIcon from "@mui/icons-material/Verified";
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
    if (!img) return "/sample.jpg";
    return img.startsWith("http") ? img : `${serverApi}/${img.replace("public/", "")}`;
  };

  const trackingSteps = [
    { label: "Order Verified", desc: "Payment Confirmed" },
    { label: "QC & Crafting Lab", desc: "Footwear Inspected" },
    { label: "Dispatched", desc: "Courier on the Way" },
    { label: "Delivered", desc: "Awaiting Receipt" },
  ];

  if (processOrders.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            bgcolor: "#f3f4f6",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <LocalShippingOutlinedIcon sx={{ fontSize: 36, color: "#9ca3af" }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.8, fontSize: "1.1rem" }}>
          No Active Shipments
        </Typography>
        <Typography variant="body2" color="text.secondary">
          You currently have no footwear orders in transit.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
      {processOrders.map((order: Order) => (
        <Card
          key={order._id}
          sx={{
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
            overflow: "hidden",
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.04)",
          }}
        >
          {/* Order Header */}
          <Box
            sx={{
              bgcolor: "#050505",
              color: "#ffffff",
              px: 3.5,
              py: 2.2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <LocalShippingOutlinedIcon sx={{ color: "#ffffff", fontSize: 22 }} />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, fontSize: "0.95rem" }}>
                  KIXORA Shipment #{order._id?.slice(-6)?.toUpperCase()}
                </Typography>
                <Typography variant="caption" sx={{ color: "#9ca3af", display: "block" }}>
                  Tracking: KX-{order._id?.slice(-8)?.toUpperCase()} &bull; Express Delivery
                </Typography>
              </Box>
            </Box>

            <Chip
              label="IN TRANSIT • ON TIME"
              size="small"
              sx={{
                bgcolor: "#16a34a",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: "0.72rem",
                letterSpacing: "0.04em",
              }}
            />
          </Box>

          {/* Stepper Tracking Visualizer */}
          <Box sx={{ px: { xs: 2, sm: 4 }, py: 3, bgcolor: "#fafafa", borderBottom: "1px solid #f3f4f6" }}>
            <Stepper activeStep={2} alternativeLabel>
              {trackingSteps.map((step) => (
                <Step key={step.label}>
                  <StepLabel
                    sx={{
                      "& .MuiStepLabel-label": {
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        color: "#374151",
                        "&.Mui-active": { color: "#111827", fontWeight: 800 },
                      },
                      "& .MuiStepIcon-root": {
                        color: "#111827",
                        fontSize: 20,
                        "&.Mui-active": { color: "#111827" },
                        "&.Mui-completed": { color: "#16a34a" },
                      },
                    }}
                  >
                    {step.label}
                    <Typography variant="caption" sx={{ display: "block", color: "#9ca3af", fontSize: "0.68rem" }}>
                      {step.desc}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Order Items */}
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
                        src={getImageSrc(product?.productImages?.[0])}
                        variant="rounded"
                        sx={{
                          width: 54,
                          height: 54,
                          borderRadius: "10px",
                          border: "1px solid #e5e7eb",
                          bgcolor: "#ffffff",
                        }}
                      />
                      <div>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: "#111827" }}>
                          {product?.productName || "KIXORA Footwear Model"}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 600 }}>
                          Qty: {item.itemQuantity}x &bull; EU {product?.productSizes?.[0] || 42} &bull; Verified Authentic
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

            {/* Bottom Total & Actions */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="caption" sx={{ color: "#6b7280", display: "block" }}>
                  Total Paid Amount
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 900, color: "#111827" }}>
                  ${order.orderTotal?.toFixed(2)}
                </Typography>
              </Box>

              <Button
                variant="contained"
                startIcon={<CheckCircleIcon />}
                onClick={() => handleUpdateOrder(order._id, OrderStatus.FINISH)}
                sx={{
                  bgcolor: "#111827",
                  color: "#ffffff",
                  borderRadius: "10px",
                  fontWeight: 800,
                  fontSize: "0.86rem",
                  px: 3,
                  py: 1,
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#000000", boxShadow: "none" },
                }}
              >
                Confirm Delivery Received
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
