import { Box, Container, Typography, Grid, Card, CardContent, Avatar, Rating } from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

export function ActiveUsers() {
  const reviews = [
    {
      name: "Davron Karimov",
      role: "Platinum VIP Food Critic",
      text: "The Tomahawk Steak flamed tableside was the most juicy and flavorful meat I've tasted in Central Asia. Exceptional service!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    },
    {
      name: "Elena Rostova",
      role: "Gastronomy Blogger",
      text: "Pistachio Baklava with Maraş ice cream brought genuine Gaziantep magic to Tashkent. 10/10 recommend for family celebrations.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    },
    {
      name: "Sardor Mukhamedov",
      role: "Corporate Executive",
      text: "Fastest thermal delivery in town. Ribs and kebabs arrived sizzling hot within 35 minutes of placing the online order.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    },
  ];

  return (
    <Box sx={{ py: 8, bgcolor: "#f8fafc" }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography variant="overline" sx={{ color: "primary.main", fontWeight: 800, letterSpacing: 2 }}>
            COMMUNITY & VIP GUESTS
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, mt: 0.5 }}>
            Loved by Food Lovers Worldwide
          </Typography>
        </Box>

        <Grid container spacing={3.5}>
          {reviews.map((rev, idx) => (
            <Grid size={{ xs: 12, md: 4 }} key={idx}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 4,
                  height: "100%",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <FormatQuoteIcon sx={{ fontSize: 40, color: "primary.main", mb: 1, opacity: 0.8 }} />
                  <Typography variant="body1" sx={{ color: "#334155", fontStyle: "italic", mb: 3, lineHeight: 1.7 }}>
                    "{rev.text}"
                  </Typography>
                </CardContent>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2, pt: 2, borderTop: "1px solid #f1f5f9" }}>
                  <Avatar src={rev.avatar} sx={{ width: 48, height: 48 }} />
                  <div>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#0f172a" }}>
                      {rev.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {rev.role}
                    </Typography>
                    <Box sx={{ display: "flex", mt: 0.3 }}>
                      <Rating value={rev.rating} readOnly size="small" />
                    </Box>
                  </div>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
