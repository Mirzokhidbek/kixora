/**
 * ============================================================================
 * ValuePropsBar.tsx - Clean Trust & Benefits Bar (Matching Mockup)
 * ============================================================================
 * 4-column horizontal features row: Free Shipping, Secure Payments, Easy Returns, 24/7 Support.
 */

import { Box, Container, Grid, Typography } from "@mui/material";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import CachedOutlinedIcon from "@mui/icons-material/CachedOutlined";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";

export function ValuePropsBar() {
  const perks = [
    {
      icon: <LocalShippingOutlinedIcon sx={{ fontSize: 24, color: "#111827" }} />,
      title: "Free Shipping",
      desc: "On orders over $100",
    },
    {
      icon: <GppGoodOutlinedIcon sx={{ fontSize: 24, color: "#111827" }} />,
      title: "Secure Payments",
      desc: "100% secure checkout",
    },
    {
      icon: <CachedOutlinedIcon sx={{ fontSize: 24, color: "#111827" }} />,
      title: "Easy Returns",
      desc: "30 days return policy",
    },
    {
      icon: <HeadsetMicOutlinedIcon sx={{ fontSize: 24, color: "#111827" }} />,
      title: "24/7 Support",
      desc: "We're here to help",
    },
  ];

  return (
    <Box sx={{ py: { xs: 4, md: 5 }, bgcolor: "#ffffff", borderTop: "1px solid #F3F4F6", borderBottom: "1px solid #F3F4F6" }}>
      <Container maxWidth="lg">
        <Grid container spacing={3} sx={{ alignItems: "center" }}>
          {perks.map((perk, idx) => (
            <Grid
              key={idx}
              size={{ xs: 6, md: 3 }}
              sx={{
                borderRight: { md: idx < 3 ? "1px solid #E5E7EB" : "none" },
                px: { md: 2.5 },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.8,
                  py: 1,
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    bgcolor: "#F9FAFB",
                    border: "1px solid #E5E7EB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {perk.icon}
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 800,
                      color: "#111827",
                      fontSize: "0.88rem",
                      lineHeight: 1.25,
                      mb: 0.2,
                    }}
                  >
                    {perk.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#6B7280",
                      fontSize: "0.78rem",
                      display: "block",
                      lineHeight: 1.2,
                    }}
                  >
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
