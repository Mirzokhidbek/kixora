import { Box, Container, Typography, Grid, Card, CardContent, Button, Chip } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";

export function Events() {
  const events = [
    {
      title: "Live Wood-Fired Masterclass with CZN Burak",
      date: "September 15, 2026",
      time: "19:00 - 22:00",
      location: "Main Dining Hall, Burak Restaurant",
      tag: "VIP MASTERCLASS",
    },
    {
      title: "Ottoman Sultan Meat & Baklava Gala Night",
      date: "September 28, 2026",
      time: "20:00 - 23:30",
      location: "VIP Terrace Garden",
      tag: "SPECIAL GALA",
    },
  ];

  return (
    <Box sx={{ py: 8, bgcolor: "#f8fafc" }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography variant="overline" sx={{ color: "primary.main", fontWeight: 800, letterSpacing: 2 }}>
            GASTRONOMIC HAPPENINGS
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1.5 }}>
            Upcoming Special Events
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Join exclusive chef masterclasses, seasonal gala dinners, and private tastings.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {events.map((event, idx) => (
            <Grid key={idx} size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: 4, borderRadius: 4, height: "100%", border: "1px solid #e2e8f0" }}>
                <CardContent sx={{ p: 0 }}>
                  <Chip label={event.tag} size="small" sx={{ bgcolor: "#f59e0b", color: "#000", fontWeight: 800, mb: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
                    {event.title}
                  </Typography>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#64748b" }}>
                      <CalendarMonthIcon sx={{ fontSize: 18, color: "primary.main" }} />
                      <Typography variant="body2">{event.date}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#64748b" }}>
                      <AccessTimeIcon sx={{ fontSize: 18, color: "primary.main" }} />
                      <Typography variant="body2">{event.time}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#64748b" }}>
                      <PlaceIcon sx={{ fontSize: 18, color: "primary.main" }} />
                      <Typography variant="body2">{event.location}</Typography>
                    </Box>
                  </Box>

                  <Button variant="contained" color="primary" sx={{ borderRadius: 2.5, fontWeight: 700 }}>
                    Reserve Invitation
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
