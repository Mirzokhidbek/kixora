import {
  Card,
  Avatar,
  Box,
  Typography,
  Chip,
  Button,
  LinearProgress,
  Grid,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import EditIcon from "@mui/icons-material/Edit";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import type { Member } from "../../../lib/types/member";
import { serverApi } from "../../../lib/config";

interface MemberInfoProps {
  member?: Member | null;
}

export function MemberInfo({ member }: MemberInfoProps) {
  const currentPoints = member?.memberPoints || 450;
  const targetPoints = 600;
  const progress = Math.min(100, (currentPoints / targetPoints) * 100);

  const getImageSrc = (img?: string) => {
    if (!img) return "";
    return img.startsWith("http") ? img : `${serverApi}/${img}`;
  };

  return (
    <Box sx={{ mb: 4 }}>
      {/* Profile Header Card */}
      <Card
        sx={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "#fff",
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          mb: 4,
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            gap: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Avatar
              src={getImageSrc(member?.memberImage)}
              sx={{
                width: 96,
                height: 96,
                bgcolor: "#f59e0b",
                color: "#000",
                fontSize: "2.5rem",
                fontWeight: 800,
                boxShadow: "0 0 25px rgba(245, 158, 11, 0.4)",
                border: "4px solid rgba(255,255,255,0.15)",
              }}
            >
              {member?.memberNick?.charAt(0)?.toUpperCase() || "M"}
            </Avatar>

            <div>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {member?.memberNick || "Guest Foodie"}
                </Typography>
                <Chip
                  icon={<EmojiEventsIcon sx={{ color: "#000 !important", fontSize: 16 }} />}
                  label="GOLD VIP MEMBER"
                  size="small"
                  sx={{
                    bgcolor: "#f59e0b",
                    color: "#000",
                    fontWeight: 800,
                    fontSize: "0.75rem",
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: "#94a3b8", mb: 0.5 }}>
                {member?.memberPhone || "+998 90 808 08 07"} &bull; {member?.memberAddress || "Tashkent, Uzbekistan"}
              </Typography>
              <Typography variant="caption" sx={{ color: "#cbd5e1" }}>
                {member?.memberDesc || "Verified Burak VIP Guest & Culinary Connoisseur"}
              </Typography>
            </div>
          </Box>

          <Button
            variant="outlined"
            sx={{
              color: "#fff",
              borderColor: "rgba(255,255,255,0.25)",
              borderRadius: 3,
              px: 3,
              "&:hover": { borderColor: "#f59e0b", bgcolor: "rgba(245, 158, 11, 0.1)" },
            }}
            startIcon={<EditIcon />}
            onClick={() => alert("Profile edit dialog")}
          >
            Edit Profile
          </Button>
        </Box>

        {/* Loyalty Points Bar */}
        <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="subtitle2" sx={{ color: "#cbd5e1" }}>
              Loyalty Tier Progress: <strong style={{ color: "#f59e0b" }}>{currentPoints} pts</strong> / {targetPoints} pts
            </Typography>
            <Typography variant="subtitle2" sx={{ color: "#f59e0b", fontWeight: 700 }}>
              {Math.max(0, targetPoints - currentPoints)} pts to PLATINUM VIP
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 10,
              borderRadius: 5,
              bgcolor: "rgba(255,255,255,0.1)",
              "& .MuiLinearProgress-bar": {
                background: "linear-gradient(90deg, #f59e0b, #fbbf24)",
                borderRadius: 5,
              },
            }}
          />
        </Box>
      </Card>

      {/* Stats Metrics */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card sx={{ p: 2.5, borderRadius: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: 2.5, bgcolor: "rgba(245, 158, 11, 0.12)", color: "#d97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ShoppingBagIcon />
              </Box>
              <div>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>TOTAL ORDERS</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>24</Typography>
              </div>
            </Box>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card sx={{ p: 2.5, borderRadius: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: 2.5, bgcolor: "rgba(16, 185, 129, 0.12)", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <EmojiEventsIcon />
              </Box>
              <div>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>BURAK POINTS</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>{currentPoints} pts</Typography>
              </div>
            </Box>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card sx={{ p: 2.5, borderRadius: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: 2.5, bgcolor: "rgba(239, 68, 68, 0.12)", color: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FavoriteIcon />
              </Box>
              <div>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>FAVORITES</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>8 Dishes</Typography>
              </div>
            </Box>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card sx={{ p: 2.5, borderRadius: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: 2.5, bgcolor: "rgba(59, 130, 246, 0.12)", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <LocationOnIcon />
              </Box>
              <div>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>SAVED LOCATIONS</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>2 Addresses</Typography>
              </div>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
