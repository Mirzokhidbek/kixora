import { Box, Container, Typography, Button, Grid } from "@mui/material";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

export function Advertisement() {
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            background: "linear-gradient(135deg, #090d16 0%, #1e293b 100%)",
            color: "#fff",
            borderRadius: 5,
            p: { xs: 4, md: 8 },
            position: "relative",
            overflow: "hidden",
            border: "1px solid rgba(245, 158, 11, 0.2)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography variant="overline" sx={{ color: "#f59e0b", fontWeight: 800, letterSpacing: 2 }}>
                THE LEGENDARY CZN BURAK SHOW
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, my: 2, fontSize: { xs: "2rem", md: "2.8rem" } }}>
                Unforgettable Culinary Spectacle & Live Fire Performances
              </Typography>
              <Typography variant="body1" sx={{ color: "#94a3b8", mb: 4, lineHeight: 1.8 }}>
                Witness giant meat cutting shows, flamed salt presentations, and world-class Turkish culinary theater right at your VIP table.
              </Typography>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<WhatsAppIcon />}
                  sx={{ borderRadius: 3, px: 3.5, fontWeight: 800 }}
                  onClick={() => window.open("https://wa.me", "_blank")}
                >
                  Book VIP Show Table
                </Button>
                <Button
                  variant="outlined"
                  sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)", borderRadius: 3, px: 3 }}
                  startIcon={<PlayCircleFilledWhiteIcon />}
                  onClick={() => window.open("https://youtube.com", "_blank")}
                >
                  Watch Show Reel
                </Button>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
                  border: "2px solid rgba(255,255,255,0.1)",
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
                  alt="Burak Fire Show"
                  sx={{ width: "100%", height: 320, objectFit: "cover" }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
