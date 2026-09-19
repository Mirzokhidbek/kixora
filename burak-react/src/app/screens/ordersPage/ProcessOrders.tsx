import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Divider,
} from "@mui/material";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";

const steps = ["Order Received", "Chef Preparing", "Out for Delivery", "Delivered"];

export function ProcessOrders() {
  const processList = [
    {
      id: "BK-98421",
      date: "Aug 29, 2026 &bull; 19:45",
      activeStep: 2,
      total: 87.0,
      address: "Amir Timur St. 45, Apt 12, Tashkent",
      items: [
        {
          name: "Burak Giant Tomahawk Steak",
          quantity: 1,
          price: 48.0,
          img: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=150&q=80",
        },
        {
          name: "Gaziantep Pistachio Baklava",
          quantity: 2,
          price: 29.0,
          img: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=150&q=80",
        },
        {
          name: "Traditional Ottoman Ayran",
          quantity: 2,
          price: 10.0,
          img: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=150&q=80",
        },
      ],
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
      {processList.map((order) => (
        <Card
          key={order.id}
          sx={{
            borderRadius: 4,
            border: "1px solid #e2e8f0",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
          }}
        >
          <Box
            sx={{
              bgcolor: "#0f172a",
              color: "#fff",
              px: 3,
              py: 2.5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Order #{order.id}
              </Typography>
              <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                In Kitchen &bull; Estimated Delivery: 20 mins
              </Typography>
            </div>
            <Chip
              icon={<LocalFireDepartmentIcon sx={{ color: "#fff !important", fontSize: 16 }} />}
              label="COOKING ON GRILL"
              sx={{ bgcolor: "#f59e0b", color: "#000", fontWeight: 800, borderRadius: 2 }}
            />
          </Box>

          <CardContent sx={{ p: 3 }}>
            {/* Live Progress Stepper */}
            <Box sx={{ my: 2 }}>
              <Stepper activeStep={order.activeStep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel
                      sx={{
                        "& .MuiStepLabel-label": {
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          color: "#64748b",
                          "&.Mui-active": { color: "#f59e0b", fontWeight: 700 },
                          "&.Mui-completed": { color: "#10b981" },
                        },
                        "& .MuiStepIcon-root.Mui-active": { color: "#f59e0b" },
                        "& .MuiStepIcon-root.Mui-completed": { color: "#10b981" },
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>

            <Divider sx={{ my: 3 }} />

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
                      {item.quantity}x &bull; ${item.price.toFixed(2)}
                    </Typography>
                  </div>
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                  ${(item.quantity * item.price).toFixed(2)}
                </Typography>
              </Box>
            ))}

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
              <DeliveryDiningIcon sx={{ color: "primary.main" }} />
              <Typography variant="body2" color="text.secondary">
                Courier Address: <strong style={{ color: "#0f172a" }}>{order.address}</strong>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
