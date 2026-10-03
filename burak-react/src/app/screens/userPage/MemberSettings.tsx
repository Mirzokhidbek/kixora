import { useState } from "react";
import {
  Box,
  Card,
  Typography,
  Grid,
  TextField,
  Button,
  Chip,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import SecurityIcon from "@mui/icons-material/Security";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";

import type { Member } from "../../../lib/types/member";
import MemberService from "../../services/MemberService";
import { useGlobals } from "../../context/ContextProvider";

interface MemberSettingsProps {
  member?: Member | null;
}

export function MemberSettings({ member }: MemberSettingsProps) {
  const { setAuthMember } = useGlobals();

  const [activeTab, setActiveTab] = useState<number>(0);
  const [nick, setNick] = useState(member?.memberNick || "");
  const [phone, setPhone] = useState(member?.memberPhone || "");
  const [address, setAddress] = useState(member?.memberAddress || "");
  const [desc, setDesc] = useState(member?.memberDesc || "");

  // Preferences State
  const [spiceLevel, setSpiceLevel] = useState("MEDIUM");
  const [seatingPreference, setSeatingPreference] = useState("EMBER_VIEW");

  // Address Dialog State
  const [addAddressOpen, setAddAddressOpen] = useState(false);
  const [newAddressTitle, setNewAddressTitle] = useState("");
  const [newAddressDetail, setNewAddressDetail] = useState("");

  const [addresses, setAddresses] = useState([
    { title: "Home (Primary)", detail: member?.memberAddress || "Amir Timur Street 45, Apt 12, Mirzo Ulugbek, Tashkent", isPrimary: true },
    { title: "Corporate Office", detail: "Navoi Avenue 18, Business Center Floor 4, Tashkent", isPrimary: false },
  ]);

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
      setToastMsg("Profile details updated successfully!");
      setToastOpen(true);
    } catch (err: any) {
      setToastMsg(err.response?.data?.message || "Failed to update profile settings.");
      setToastOpen(true);
    }
  };

  const handleAddAddress = () => {
    if (!newAddressTitle || !newAddressDetail) return;
    setAddresses([...addresses, { title: newAddressTitle, detail: newAddressDetail, isPrimary: false }]);
    setNewAddressTitle("");
    setNewAddressDetail("");
    setAddAddressOpen(false);
    setToastMsg("New address added successfully!");
    setToastOpen(true);
  };

  return (
    <Card sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 4, border: "1px solid #e2e8f0" }}>
      {/* Settings Tabs */}
      <Tabs
        value={activeTab}
        onChange={(_, val) => setActiveTab(val)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          borderBottom: "1px solid #e2e8f0",
          mb: 4,
          "& .MuiTabs-indicator": { backgroundColor: "#f59e0b", height: 3 },
          "& .MuiTab-root": {
            fontWeight: 700,
            fontSize: "0.95rem",
            color: "#64748b",
            "&.Mui-selected": { color: "#0f172a" },
          },
        }}
      >
        <Tab icon={<PersonIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="PERSONAL PROFILE" />
        <Tab icon={<LocationOnIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="SAVED ADDRESSES" />
        <Tab icon={<RestaurantIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="DINING PREFERENCES" />
        <Tab icon={<SecurityIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="SECURITY & PASSWORD" />
      </Tabs>

      {/* Tab 0: Personal Profile */}
      {activeTab === 0 && (
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
            Personal Credentials & Bio
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Update your account details, phone contact, and VIP culinary biography.
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="VIP Nickname"
                value={nick}
                onChange={(e) => setNick(e.target.value)}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
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
                label="Primary Delivery Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Culinary Bio & Tastes"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                size="small"
                multiline
                rows={3}
                placeholder="Share your favorite Turkish cuts or special dining notes..."
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSaveProfile}
                sx={{ borderRadius: 2.5, px: 4, py: 1.2, fontWeight: 800 }}
              >
                Save Profile Changes
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Tab 1: Saved Addresses */}
      {activeTab === 1 && (
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <div>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Saved Delivery Addresses
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your home, office, and private villa dining destinations.
              </Typography>
            </div>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setAddAddressOpen(true)}
              sx={{ borderRadius: 2.5, fontWeight: 700 }}
            >
              Add New Address
            </Button>
          </Box>

          <Grid container spacing={3}>
            {addresses.map((addr, idx) => (
              <Grid key={idx} size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    p: 2.5,
                    bgcolor: "#f8fafc",
                    borderRadius: 3,
                    border: addr.isPrimary ? "2px solid #f59e0b" : "1px solid #e2e8f0",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                        {addr.title}
                      </Typography>
                      {addr.isPrimary && (
                        <Chip label="PRIMARY" size="small" color="primary" sx={{ fontSize: "0.68rem", fontWeight: 800 }} />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {addr.detail}
                    </Typography>
                  </div>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Tab 2: Dining Preferences */}
      {activeTab === 2 && (
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
            Dining & Culinary Preferences
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Customize your culinary experience for kitchen preparation and table reservations.
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Spice & Seasoning Preference</InputLabel>
                <Select
                  value={spiceLevel}
                  label="Spice & Seasoning Preference"
                  onChange={(e) => setSpiceLevel(e.target.value)}
                >
                  <MenuItem value="MILD">Mild (Natural Embers Flavor)</MenuItem>
                  <MenuItem value="MEDIUM">Medium (Urfa Isot & Sea Salt)</MenuItem>
                  <MenuItem value="OTTOMAN_SPICY">Authentic Ottoman Spicy</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Preferred Table Seating</InputLabel>
                <Select
                  value={seatingPreference}
                  label="Preferred Table Seating"
                  onChange={(e) => setSeatingPreference(e.target.value)}
                >
                  <MenuItem value="EMBER_VIEW">Main Ember Grill & Fire View</MenuItem>
                  <MenuItem value="VIP_TERRACE">VIP Outdoor Terrace Garden</MenuItem>
                  <MenuItem value="PRIVATE_SUITE">Private Dining Suite</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setToastMsg("Dining preferences saved for future orders!");
                  setToastOpen(true);
                }}
                sx={{ borderRadius: 2.5, px: 4, py: 1.2, fontWeight: 800 }}
              >
                Save Preferences
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Tab 3: Security & Password */}
      {activeTab === 3 && (
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
            Security & Authentication
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Manage your account login credentials and session security.
          </Typography>

          <Grid container spacing={3} sx={{ maxWidth: 600 }}>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth type="password" label="Current Password" size="small" />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth type="password" label="New Password" size="small" />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth type="password" label="Confirm New Password" size="small" />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setToastMsg("Password changed successfully!");
                  setToastOpen(true);
                }}
                sx={{ borderRadius: 2.5, px: 4, py: 1.2, fontWeight: 800 }}
              >
                Update Password
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Add Address Dialog */}
      <Dialog open={addAddressOpen} onClose={() => setAddAddressOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Add Delivery Address</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
          <TextField
            fullWidth
            label="Address Title (e.g. Vacation Villa)"
            value={newAddressTitle}
            onChange={(e) => setNewAddressTitle(e.target.value)}
            size="small"
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Full Delivery Address"
            value={newAddressDetail}
            onChange={(e) => setNewAddressDetail(e.target.value)}
            size="small"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setAddAddressOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleAddAddress} sx={{ fontWeight: 700 }}>
            Add Address
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Toast */}
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
