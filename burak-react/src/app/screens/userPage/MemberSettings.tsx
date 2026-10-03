import { useState } from "react";
import {
  Box,
  Card,
  Typography,
  Grid,
  TextField,
  Button,
  Chip,
  Snackbar,
  Alert,
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import type { Member } from "../../../lib/types/member";
import MemberService from "../../services/MemberService";
import { useGlobals } from "../../context/ContextProvider";

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

  const handleSave = async () => {
    try {
      const memberService = new MemberService();
      const updated = await memberService.updateMember({
        memberNick: nick,
        memberPhone: phone,
        memberAddress: address,
        memberDesc: desc,
      });
      setAuthMember(updated);
      setToastMsg("Profile settings updated successfully!");
      setToastOpen(true);
    } catch (err: any) {
      setToastMsg(err.response?.data?.message || "Failed to update profile settings.");
      setToastOpen(true);
    }
  };

  return (
    <Grid container spacing={4}>
      {/* Account Info */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ p: 3.5, borderRadius: 4, height: "100%", border: "1px solid #e2e8f0" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
            <SecurityIcon sx={{ color: "primary.main" }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Personal Credentials
            </Typography>
          </Box>

          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Full Nickname"
                value={nick}
                onChange={(e) => setNick(e.target.value)}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Phone Contact"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Delivery Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Bio Description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                size="small"
                multiline
                rows={2}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                sx={{ borderRadius: 2, fontWeight: 700, mt: 1 }}
              >
                Save Settings
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Grid>

      {/* Saved Addresses */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ p: 3.5, borderRadius: 4, height: "100%", border: "1px solid #e2e8f0" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocationOnIcon sx={{ color: "primary.main" }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Saved Addresses
              </Typography>
            </Box>
            <Button size="small" sx={{ color: "primary.dark", fontWeight: 700 }}>
              + Add Address
            </Button>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: 3, border: "1.5px solid #f59e0b" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Home (Primary)
                </Typography>
                <Chip label="PRIMARY" size="small" color="primary" sx={{ fontSize: "0.68rem", height: 20 }} />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {address || "Amir Timur Street 45, Apt 12, Mirzo Ulugbek, Tashkent"}
              </Typography>
            </Box>

            <Box sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: 3, border: "1px solid #e2e8f0" }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                Corporate Office
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Navoi Avenue 18, Business Center Floor 4, Tashkent
              </Typography>
            </Box>
          </Box>
        </Card>
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
    </Grid>
  );
}
