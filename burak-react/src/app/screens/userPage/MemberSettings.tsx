import { useState } from "react";
import {
  Box,
  Card,
  Typography,
  Grid,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import type { Member } from "../../../lib/types/member";
import MemberService from "../../services/MemberService";
import { useGlobals } from "../../hooks/useGlobals";

interface MemberSettingsProps {
  member?: Member | null;
}

export function MemberSettings({ member }: MemberSettingsProps) {
  const { setAuthMember } = useGlobals();

  const [nick, setNick] = useState(member?.memberNick || "");
  const [phone, setPhone] = useState(member?.memberPhone || "");
  const [address, setAddress] = useState(member?.memberAddress || "");
  const [desc, setDesc] = useState(member?.memberDesc || "");

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const handleSaveProfile = async () => {
    try {
      const memberService = new MemberService();
      const updated = await memberService.updateMember({
        memberNick: nick,
        memberPhone: phone,
        memberAddress: address,
        memberDesc: desc,
      });
      setAuthMember(updated);
      setToastMsg("Profile updated successfully! ✅");
      setToastOpen(true);
    } catch (err: any) {
      setToastMsg(err.response?.data?.message || "Failed to update profile.");
      setToastOpen(true);
    }
  };

  return (
    <Card
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 5,
        border: "1px solid #f1f5f9",
        bgcolor: "#ffffff",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 900, color: "#0f172a", mb: 0.5 }}>
          Account Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Easily update your name, contact phone, delivery address, and notes.
        </Typography>
      </Box>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Your Name / Nickname"
            value={nick}
            onChange={(e) => setNick(e.target.value)}
            size="small"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            size="small"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Delivery Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            size="small"
            placeholder="e.g. Amir Timur Street 45, Apt 12, Tashkent"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Short Bio / Notes"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            size="small"
            multiline
            rows={2}
            placeholder="e.g. Prefer spicy food, call before arrival..."
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveProfile}
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.2,
              fontWeight: 800,
              fontSize: "0.95rem",
              bgcolor: "#eab308",
              color: "#ffffff",
              boxShadow: "0 8px 20px rgba(234, 179, 8, 0.35)",
              "&:hover": { bgcolor: "#ca8a04" },
            }}
          >
            Save Changes
          </Button>
        </Grid>
      </Grid>

      {/* Confirmation Toast */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
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
