import { useRef } from "react";
import {
  Card,
  Avatar,
  Box,
  Typography,
  Chip,
  IconButton,
  Grid,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import type { Member } from "../../../lib/types/member";
import { serverApi } from "../../../lib/config";
import MemberService from "../../services/MemberService";
import { useGlobals } from "../../hooks/useGlobals";

interface MemberInfoProps {
  member?: Member | null;
}

export function MemberInfo({ member }: MemberInfoProps) {
  const { setAuthMember } = useGlobals();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentPoints = member?.memberPoints || 0;

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
    <Box sx={{ mb: 4, width: "100%" }}>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        style={{ display: "none" }}
      />

      {/* Simplified Modern Profile Header Card */}
      <Card
        sx={{
          bgcolor: "#ffffff",
          p: { xs: 3, md: 4 },
          borderRadius: 5,
          border: "1px solid #f1f5f9",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "center", sm: "flex-start", md: "center" },
            gap: { xs: 2.5, sm: 3.5 },
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          {/* Avatar with Camera Icon */}
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={getImageSrc(member?.memberImage)}
              sx={{
                width: { xs: 85, md: 95 },
                height: { xs: 85, md: 95 },
                bgcolor: "#f59e0b",
                color: "#fff",
                fontSize: "2.2rem",
                fontWeight: 900,
                boxShadow: "0 8px 25px rgba(245, 158, 11, 0.3)",
                border: "4px solid #ffffff",
              }}
            >
              {member?.memberNick?.charAt(0)?.toUpperCase() || "U"}
            </Avatar>

            <IconButton
              size="small"
              onClick={() => fileInputRef.current?.click()}
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                bgcolor: "#f59e0b",
                color: "#ffffff",
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                "&:hover": { bgcolor: "#d97706" },
              }}
            >
              <PhotoCameraIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>

          {/* User Details */}
          <Box sx={{ flexGrow: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 0.8,
                flexWrap: "wrap",
                justifyContent: { xs: "center", sm: "flex-start" },
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 900, color: "#0f172a", fontSize: { xs: "1.6rem", md: "1.9rem" } }}>
                {member?.memberNick || "Member"}
              </Typography>
              <Chip
                label="VIP MEMBER"
                size="small"
                sx={{
                  bgcolor: "#fffbeb",
                  color: "#d97706",
                  border: "1px solid #fef3c7",
                  fontWeight: 800,
                  fontSize: "0.72rem",
                }}
              />
            </Box>

            <Typography variant="body2" sx={{ color: "#64748b", mb: 0.5, fontWeight: 500 }}>
              📞 {member?.memberPhone || "+998 90 123 45 67"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
              📍 {member?.memberAddress || "Tashkent, Uzbekistan"}
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* 3 Simple Metrics Cards */}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 4, sm: 4, md: 4 }}>
          <Card
            sx={{
              p: { xs: 2, md: 2.5 },
              textAlign: "center",
              borderRadius: 4,
              border: "1px solid #f1f5f9",
              bgcolor: "#ffffff",
              boxShadow: "0 6px 20px rgba(0,0,0,0.02)",
            }}
          >
            <ShoppingBagOutlinedIcon sx={{ color: "#f59e0b", fontSize: { xs: 26, md: 30 }, mb: 0.5 }} />
            <Typography variant="h5" sx={{ fontWeight: 900, color: "#0f172a", fontSize: { xs: "1.2rem", md: "1.5rem" } }}>
              12
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, fontSize: { xs: "0.7rem", md: "0.8rem" } }}>
              Total Orders
            </Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 4, sm: 4, md: 4 }}>
          <Card
            sx={{
              p: { xs: 2, md: 2.5 },
              textAlign: "center",
              borderRadius: 4,
              border: "1px solid #f1f5f9",
              bgcolor: "#ffffff",
              boxShadow: "0 6px 20px rgba(0,0,0,0.02)",
            }}
          >
            <EmojiEventsOutlinedIcon sx={{ color: "#10b981", fontSize: { xs: 26, md: 30 }, mb: 0.5 }} />
            <Typography variant="h5" sx={{ fontWeight: 900, color: "#0f172a", fontSize: { xs: "1.2rem", md: "1.5rem" } }}>
              {currentPoints}
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, fontSize: { xs: "0.7rem", md: "0.8rem" } }}>
              Points
            </Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 4, sm: 4, md: 4 }}>
          <Card
            sx={{
              p: { xs: 2, md: 2.5 },
              textAlign: "center",
              borderRadius: 4,
              border: "1px solid #f1f5f9",
              bgcolor: "#ffffff",
              boxShadow: "0 6px 20px rgba(0,0,0,0.02)",
            }}
          >
            <VerifiedOutlinedIcon sx={{ color: "#3b82f6", fontSize: { xs: 26, md: 30 }, mb: 0.5 }} />
            <Typography variant="h5" sx={{ fontWeight: 900, color: "#0f172a", fontSize: { xs: "1.2rem", md: "1.5rem" } }}>
              Active
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, fontSize: { xs: "0.7rem", md: "0.8rem" } }}>
              Status
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
