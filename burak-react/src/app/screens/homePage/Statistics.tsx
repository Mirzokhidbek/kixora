import { Box, Container, Grid, Typography } from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import VerifiedIcon from "@mui/icons-material/Verified";

export function Statistics() {
  const stats = [
    { count: "12+", label: "Years of Culinary Mastery", icon: <VerifiedIcon sx={{ fontSize: 36, color: "#f59e0b" }} /> },
    { count: "150+", label: "Artisan Menu Specialties", icon: <RestaurantIcon sx={{ fontSize: 36, color: "#f59e0b" }} /> },
    { count: "250K+", label: "Delighted Global Guests", icon: <PeopleAltIcon sx={{ fontSize: 36, color: "#f59e0b" }} /> },
    { count: "100%", label: "Halal & Organic Certified", icon: <EmojiEventsIcon sx={{ fontSize: 36, color: "#f59e0b" }} /> },
  ];

  return (
    <Box sx={{ py: 6, bgcolor: "#0f172a", color: "#fff", position: "relative", overflow: "hidden" }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {stats.map((item, idx) => (
            <Grid size={{ xs: 6, md: 3 }} key={idx}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 3,
                  bgcolor: "rgba(255, 255, 255, 0.03)",
                  borderRadius: 4,
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    borderColor: "#f59e0b",
                    bgcolor: "rgba(245, 158, 11, 0.05)",
                  },
                }}
              >
                <Box sx={{ mb: 1.5, display: "inline-flex" }}>{item.icon}</Box>
                <Typography variant="h3" sx={{ fontWeight: 800, color: "#f59e0b", mb: 0.5 }}>
                  {item.count}
                </Typography>
                <Typography variant="body2" sx={{ color: "#94a3b8", fontWeight: 600 }}>
                  {item.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
