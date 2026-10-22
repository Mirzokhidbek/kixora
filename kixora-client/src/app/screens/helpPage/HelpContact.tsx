import { useState } from "react";
import { Card, Typography, Grid, TextField, Button, Snackbar, Alert } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SupportService from "../../services/SupportService";

export function HelpContact() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [sending, setSending] = useState(false);

  /** Sends the inquiry to the server (previously it only showed a "sent" message) */
  const handleSubmit = async () => {
    if (!name.trim() || !contact.trim() || message.trim().length < 10) {
      setToastMsg("Please fill out all fields (message at least 10 characters).");
      setToastOpen(true);
      return;
    }
    setSending(true);
    try {
      await new SupportService().sendMessage({ name: name.trim(), contact: contact.trim(), message: message.trim() });
      setToastMsg("Thank you! Your message was received. We will reply to the contact you provided.");
      setName("");
      setContact("");
      setMessage("");
    } catch (err: any) {
      setToastMsg(err?.response?.data?.message || "Sending failed. Please try again.");
    } finally {
      setSending(false);
      setToastOpen(true);
    }
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
            disabled={sending}
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
