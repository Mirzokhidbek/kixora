import { Box, Container, Grid, Typography } from "@mui/material";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";

export function ValuePropsBar() {
  const perks = [
    {
      icon: <LocalShippingOutlinedIcon sx={{ fontSize: 26, color: "#000000" }} />,
      title: "Free Shipping",
      desc: "On all orders over $100",
    },
    {
      icon: <AutorenewOutlinedIcon sx={{ fontSize: 26, color: "#000000" }} />,
      title: "Easy Returns",
      desc: "30-day return policy",
    },
    {
      icon: <LockOutlinedIcon sx={{ fontSize: 26, color: "#000000" }} />,
      title: "Secure Payment",
      desc: "100% protected checkout",
    },
    {
      icon: <HeadsetMicOutlinedIcon sx={{ fontSize: 26, color: "#000000" }} />,
      title: "24/7 Support",
      desc: "Dedicated customer service",
    },
  ];

  return (
    <Box sx={{ py: 5, bgcolor: "#ffffff", borderBottom: "1px solid #f3f4f6" }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {perks.map((perk, idx) => (
            <Grid key={idx} size={{ xs: 6, md: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: { xs: 1.5, sm: 2 },
                  borderRadius: 3,
                  bgcolor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    width: 46,
                    height: 46,
                    borderRadius: "50%",
                    bgcolor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {perk.icon}
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#111827", lineHeight: 1.2 }}>
                    {perk.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#6b7280", fontSize: "0.78rem" }}>
                    {perk.desc}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
