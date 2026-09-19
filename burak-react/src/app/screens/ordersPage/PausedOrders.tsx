import { Box, Typography, Card, CardContent, Button, Avatar, Chip } from "@mui/material";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PaymentIcon from "@mui/icons-material/Payment";

export function PausedOrders() {
  const pausedList = [
    {
      id: "BK-PAUSED-101",
      date: "Today, 14:30",
      total: 36.5,
      items: [
        {
          name: "Sultan Meter Kebab",
          quantity: 1,
          price: 36.5,
          img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=150&q=80",
        },
      ],
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {pausedList.map((order) => (
        <Card
          key={order.id}
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
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <PauseCircleFilledIcon sx={{ color: "#f59e0b" }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                Order #{order.id}
              </Typography>
            </Box>
            <Chip label="PAUSED / UNPAID" size="small" sx={{ bgcolor: "#f59e0b", color: "#000", fontWeight: 800 }} />
          </Box>

          <CardContent sx={{ p: 3 }}>
            {order.items.map((item, idx) => (
              <Box
                key={idx}
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
                  <Avatar src={item.img} variant="rounded" sx={{ width: 48, height: 48, borderRadius: 2 }} />
                  <div>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>
                      {item.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Quantity: {item.quantity}x
                    </Typography>
                  </div>
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                  ${item.price.toFixed(2)}
                </Typography>
              </Box>
            ))}

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pt: 1 }}>
              <Button color="error" startIcon={<DeleteOutlineIcon />}>
                Cancel Order
              </Button>
              <Button variant="contained" color="primary" startIcon={<PaymentIcon />} sx={{ fontWeight: 800, px: 3 }}>
                Proceed to Payment (${order.total.toFixed(2)})
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
