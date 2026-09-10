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
import { MemberType } from "../../../lib/enums/common.enum";
import { getImageUrl } from "../../../lib/config";
import MemberService from "../../services/MemberService";
import { useGlobals } from "../../hooks/useGlobals";

interface MemberInfoProps {
  member?: Member | null;
}

export function MemberInfo({ member }: MemberInfoProps) {
  const { setAuthMember } = useGlobals();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentPoints = member?.memberPoints || 0;

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

      {/* Profile Header Card */}
      <Card
        sx={{
          bgcolor: "#ffffff",
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          border: "1px solid #e5e7eb",
          boxShadow: "none",
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
              src={getImageUrl(member?.memberImage)}
              sx={{
                width: { xs: 85, md: 95 },
                height: { xs: 85, md: 95 },
                bgcolor: "#111827",
                color: "#ffffff",
                fontSize: "2.2rem",
                fontWeight: 900,
                border: "3px solid #e5e7eb",
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
                bgcolor: "#000000",
                color: "#ffffff",
                border: "2px solid #ffffff",
                p: 0.8,
                "&:hover": { bgcolor: "#262626" },
              }}
            >
              <PhotoCameraIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>

          {/* User Bio & Tier Badges */}
          <Box sx={{ flexGrow: 1 }}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: { xs: "center", sm: "flex-start" },
                gap: 1.5,
                mb: 0.8,
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 900, color: "#111827", letterSpacing: "-0.02em" }}>
                {member?.memberNick}
              </Typography>

              <Chip
                icon={<VerifiedOutlinedIcon sx={{ fontSize: "16px !important", color: "#10b981" }} />}
                label={member?.memberType === MemberType.RESTAURANT ? "Brand Admin" : "VIP Member"}
                sx={{
                  bgcolor: "#f3f4f6",
                  color: "#111827",
                  fontWeight: 800,
                  fontSize: "0.75rem",
                  borderRadius: 2,
                }}
              />
            </Box>

            <Typography variant="body2" sx={{ color: "#6b7280", mb: 0.5, fontWeight: 600 }}>
              <i className="fa-solid fa-envelope" style={{ marginRight: 6, fontSize: "0.85rem" }}></i>
              {member?.memberEmail || member?.memberPhone || "No email connected"} &bull; Joined {new Date(member?.createdAt || Date.now()).getFullYear()}
            </Typography>

            <Typography variant="caption" sx={{ color: "#9ca3af", fontStyle: "italic" }}>
              {member?.memberDesc || "KIXORA luxury footwear collector & community member."}
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* Metrics Row */}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card
            sx={{
              p: 3,
              borderRadius: 3.5,
              bgcolor: "#ffffff",
              border: "1px solid #e5e7eb",
              boxShadow: "none",
              display: "flex",
              alignItems: "center",
              gap: 2.5,
            }}
          >
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                bgcolor: "#f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#111827",
              }}
            >
              <EmojiEventsOutlinedIcon />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 700, textTransform: "uppercase" }}>
                VIP Points
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: "#111827" }}>
                {currentPoints} pts
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Card
            sx={{
              p: 3,
              borderRadius: 3.5,
              bgcolor: "#ffffff",
              border: "1px solid #e5e7eb",
              boxShadow: "none",
              display: "flex",
              alignItems: "center",
              gap: 2.5,
            }}
          >
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                bgcolor: "#f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#111827",
              }}
            >
              <ShoppingBagOutlinedIcon />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 700, textTransform: "uppercase" }}>
                Membership Tier
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: "#111827" }}>
                KIXORA Elite
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
