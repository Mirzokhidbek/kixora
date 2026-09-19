import { Card, Typography, Grid, TextField, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export function HelpContact() {
  return (
    <Card sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, bgcolor: "#f8fafc", border: "1px solid #e2e8f0" }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
        Have a Specific Inquiry?
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Send a direct message to our restaurant management and executive chef team.
      </Typography>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="Your Name" size="small" sx={{ bgcolor: "#fff" }} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="Your Email / Phone" size="small" sx={{ bgcolor: "#fff" }} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField fullWidth multiline rows={3} label="Your Message or Special Request" sx={{ bgcolor: "#fff" }} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            onClick={() => alert("Your message has been dispatched to Burak Guest Relations!")}
            sx={{ borderRadius: 2, px: 3.5, py: 1, fontWeight: 700 }}
          >
            Submit Inquiry
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
}
