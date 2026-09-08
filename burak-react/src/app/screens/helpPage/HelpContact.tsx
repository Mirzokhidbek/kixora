import { useState } from "react";
import { Card, Typography, Grid, TextField, Button, Snackbar, Alert } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

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
    setToastMsg("Thank you! Your inquiry has been sent to KIXORA Shoe Care & Support.");
    setToastOpen(true);
    setName("");
    setContact("");
    setMessage("");
  };

  return (
    <Card sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, bgcolor: "#f9fafb", border: "1px solid #e5e7eb", boxShadow: "none" }}>
      <Typography variant="h5" sx={{ fontWeight: 900, mb: 0.5, color: "#000000" }}>
        Have a Specific Question?
      </Typography>
      <Typography variant="body2" sx={{ color: "#6b7280", mb: 3 }}>
        Send a direct message to our customer care and footwear specialists.
      </Typography>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="small"
            sx={{ bgcolor: "#fff", "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Your Email or Phone"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            size="small"
            sx={{ bgcolor: "#fff", "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Your Message or Size Inquiry"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ bgcolor: "#fff", "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={handleSubmit}
            sx={{
              py: 1.2,
              px: 4,
              borderRadius: 9999,
              fontWeight: 800,
              fontSize: "0.9rem",
              bgcolor: "#000000",
              color: "#ffffff",
              textTransform: "none",
              boxShadow: "none",
              "&:hover": { bgcolor: "#262626" },
            }}
          >
            Send Inquiry
          </Button>
        </Grid>
      </Grid>

      <Snackbar
        open={toastOpen}
        autoHideDuration={3500}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%", borderRadius: 2, fontWeight: 700 }}>
          {toastMsg}
        </Alert>
      </Snackbar>
    </Card>
  );
}
