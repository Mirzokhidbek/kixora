import { useRef } from "react";
import {
  Card,
  Avatar,
  Box,
  Typography,
  Chip,
  IconButton,
  LinearProgress,
  Grid,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import type { Member } from "../../../lib/types/member";
import { serverApi } from "../../../lib/config";
import MemberService from "../../services/MemberService";
import { useGlobals } from "../../context/ContextProvider";

interface MemberInfoProps {
  member?: Member | null;
}

export function MemberInfo({ member }: MemberInfoProps) {
  const { setAuthMember } = useGlobals();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentPoints = member?.memberPoints || 0;
  const targetPoints = 500;
  const progress = Math.min(100, (currentPoints / targetPoints) * 100);

  const getImageSrc = (img?: string) => {
    if (!img) return "";
    return img.startsWith("http") ? img : `${serverApi}/${img}`;
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const memberService = new MemberService();
      const updated = await memberService.updateMember({ memberImage: file });
      setAuthMember(updated);
    } catch (err) {
      console.log("Error updating profile image:", err);
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        style={{ display: "none" }}
      />

      {/* Profile Header Card */}
      <Card
        sx={{
          background: "linear-gradient(135deg, #090d16 0%, #1e293b 100%)",
          color: "#fff",
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          mb: 4,
          border: "1px solid rgba(245, 158, 11, 0.2)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4)",
          position: "relative",
          overflow: "hidden",
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
            {/* Avatar with Camera Overlay */}
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={getImageSrc(member?.memberImage)}
                sx={{
                  width: { xs: 80, md: 100 },
                  height: { xs: 80, md: 100 },
                  bgcolor: "#f59e0b",
                  color: "#000",
                  fontSize: "2.5rem",
                  fontWeight: 800,
                  boxShadow: "0 0 25px rgba(245, 158, 11, 0.4)",
                  border: "4px solid rgba(255,255,255,0.15)",
                }}
              >
                {member?.memberNick?.charAt(0)?.toUpperCase() || "U"}
              </Avatar>

              <IconButton
                size="small"
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  position: "absolute",
                  bottom: -4,
                  right: -4,
                  bgcolor: "#f59e0b",
                  color: "#000",
                  "&:hover": { bgcolor: "#d97706" },
                  boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                }}
              >
                <PhotoCameraIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>

            <div>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5, flexWrap: "wrap" }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {member?.memberNick || "VIP Member"}
                </Typography>
                <Chip
                  icon={<EmojiEventsIcon sx={{ color: "#000 !important", fontSize: 16 }} />}
                  label={currentPoints >= 300 ? "PLATINUM VIP" : "GOLD VIP MEMBER"}
                  size="small"
                  sx={{
                    bgcolor: "#f59e0b",
                    color: "#000",
                    fontWeight: 800,
                    fontSize: "0.75rem",
                  }}
                />
                <Chip
                  icon={<VerifiedUserIcon sx={{ color: "#10b981 !important", fontSize: 14 }} />}
                  label="VERIFIED"
                  size="small"
                  sx={{
                    bgcolor: "rgba(16, 185, 129, 0.15)",
                    color: "#10b981",
                    fontWeight: 700,
                    fontSize: "0.72rem",
                  }}
                />
              </Box>

              <Typography variant="body2" sx={{ color: "#94a3b8", mb: 0.5 }}>
                {member?.memberPhone || "+998 90 123 45 67"} &bull; {member?.memberAddress || "Tashkent, Uzbekistan"}
              </Typography>
              <Typography variant="caption" sx={{ color: "#cbd5e1" }}>
                {member?.memberDesc || "Valued Burak VIP Gourmet Club Member"}
              </Typography>
            </div>
          </Box>
        </Box>

        {/* Loyalty Points Bar */}
        <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, flexWrap: "wrap", gap: 1 }}>
            <Typography variant="subtitle2" sx={{ color: "#cbd5e1" }}>
              Loyalty Tier Progress: <strong style={{ color: "#f59e0b" }}>{currentPoints} pts</strong> / {targetPoints} pts
            </Typography>
            <Typography variant="subtitle2" sx={{ color: "#f59e0b", fontWeight: 700 }}>
              {Math.max(0, targetPoints - currentPoints)} pts to {currentPoints >= 300 ? "DIAMOND VIP" : "PLATINUM VIP"}
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
          <Card sx={{ p: 2.5, borderRadius: 3, border: "1px solid #e2e8f0" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: 2.5, bgcolor: "rgba(245, 158, 11, 0.12)", color: "#d97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ShoppingBagIcon />
              </Box>
              <div>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>TOTAL ORDERS</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>12</Typography>
              </div>
            </Box>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card sx={{ p: 2.5, borderRadius: 3, border: "1px solid #e2e8f0" }}>
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
          <Card sx={{ p: 2.5, borderRadius: 3, border: "1px solid #e2e8f0" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: 2.5, bgcolor: "rgba(239, 68, 68, 0.12)", color: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FavoriteIcon />
              </Box>
              <div>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>FAVORITES</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>6 Dishes</Typography>
              </div>
            </Box>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card sx={{ p: 2.5, borderRadius: 3, border: "1px solid #e2e8f0" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: 2.5, bgcolor: "rgba(59, 130, 246, 0.12)", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <LocationOnIcon />
              </Box>
              <div>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>SAVED ADDRESSES</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>2 Locations</Typography>
              </div>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
