import { Box, Typography, Card, CardContent, Button, Avatar, Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReplayIcon from "@mui/icons-material/Replay";

export function FinishedOrders() {
  const finishedList = [
    {
      id: "BK-94710",
      date: "Aug 26, 2026 &bull; 13:20",
      total: 56.4,
      items: [
        {
          name: "Sultan Meter Kebab",
          quantity: 1,
          price: 36.5,
          img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=150&q=80",
        },
        {
          name: "Golden Cheddar Burger",
          quantity: 1,
          price: 19.9,
          img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=150&q=80",
        },
      ],
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {finishedList.map((order) => (
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
              bgcolor: "#0f172a",
              color: "#fff",
              px: 3,
              py: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <CheckCircleIcon sx={{ color: "#10b981" }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                Order #{order.id}
              </Typography>
            </Box>
            <Chip label="DELIVERED" size="small" sx={{ bgcolor: "#10b981", color: "#fff", fontWeight: 800 }} />
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
                  mb: 1.5,
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
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#0f172a" }}>
                Total Paid: ${order.total.toFixed(2)}
              </Typography>
              <Button variant="outlined" color="primary" startIcon={<ReplayIcon />} sx={{ fontWeight: 800, borderRadius: 2 }}>
                Reorder Again
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
