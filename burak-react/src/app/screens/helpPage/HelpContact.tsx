import { useState } from "react";
import { Card, Typography, Grid, TextField, Button, Snackbar, Alert } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export function HelpContact() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const handleSubmit = () => {
    if (!name || !contact || !message) {
      setToastMsg("Please fill out all fields before submitting.");
      setToastOpen(true);
      return;
    }
    setToastMsg("Thank you! Your message has been sent to Burak VIP Concierge.");
    setToastOpen(true);
    setName("");
    setContact("");
    setMessage("");
  };

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
          <TextField
            fullWidth
            label="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="small"
            sx={{ bgcolor: "#fff" }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Your Email / Phone"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            size="small"
            sx={{ bgcolor: "#fff" }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Your Message or Special Request"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ bgcolor: "#fff" }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            onClick={handleSubmit}
            sx={{ borderRadius: 2, px: 3.5, py: 1, fontWeight: 700 }}
          >
            Submit Inquiry
          </Button>
        </Grid>
      </Grid>

      <Snackbar
        open={toastOpen}
        autoHideDuration={3500}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%", borderRadius: 3, fontWeight: 700 }}>
          {toastMsg}
        </Alert>
      </Snackbar>
    </Card>
  );
}
