import { Box, Container, Grid, Typography } from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import VerifiedIcon from "@mui/icons-material/Verified";

export function Statistics() {
  const stats = [
    { count: "12+", label: "Years of Culinary Art", icon: <VerifiedIcon sx={{ fontSize: 32, color: "#f59e0b" }} /> },
    { count: "150+", label: "Artisan Menu Dishes", icon: <RestaurantIcon sx={{ fontSize: 32, color: "#f59e0b" }} /> },
    { count: "250K+", label: "Happy Global Guests", icon: <PeopleAltIcon sx={{ fontSize: 32, color: "#f59e0b" }} /> },
    { count: "100%", label: "Halal & Prime Fresh", icon: <EmojiEventsIcon sx={{ fontSize: 32, color: "#f59e0b" }} /> },
  ];

  return (
    <Box sx={{ py: 8, bgcolor: "#fbfbfe", position: "relative", overflow: "hidden" }}>
      <Container maxWidth="lg">
        <Grid container spacing={3.5}>
          {stats.map((item, idx) => (
            <Grid size={{ xs: 6, md: 3 }} key={idx}>
              <Box
                sx={{
                  textAlign: "center",
                  p: { xs: 3, md: 4 },
                  bgcolor: "#ffffff",
                  borderRadius: 5,
                  border: "1px solid #f1f5f9",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.03)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 15px 35px rgba(245, 158, 11, 0.12)",
                    borderColor: "#fef3c7",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 3,
                    bgcolor: "#fffbeb",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  {item.icon}
                </Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 900,
                    color: "#0f172a",
                    mb: 0.5,
                    fontSize: { xs: "2rem", md: "2.4rem" },
                  }}
                >
                  {item.count}
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 600 }}>
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
