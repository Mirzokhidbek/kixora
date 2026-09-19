import { Box, Card, Typography, Grid, TextField, Button, Chip } from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export function MemberSettings() {
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
              <TextField fullWidth label="Full Nickname" defaultValue="Miro Developer" size="small" />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Email Address" defaultValue="mirodeveloper7@gmail.com" size="small" />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Phone Contact" defaultValue="+998 90 808 08 07" size="small" />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button variant="contained" color="primary" sx={{ borderRadius: 2, fontWeight: 700, mt: 1 }}>
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
                Amir Timur Street 45, Apt 12, Mirzo Ulugbek, Tashkent
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
    </Grid>
  );
}
