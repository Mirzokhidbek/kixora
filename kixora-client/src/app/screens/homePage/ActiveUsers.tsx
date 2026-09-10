import { useSelector } from "react-redux";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Rating,
  Chip,
} from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import VerifiedIcon from "@mui/icons-material/Verified";
import { retrieveTopUsers } from "./selector";
import { getImageUrl } from "../../../lib/config";

export function ActiveUsers() {
  const topUsers = useSelector(retrieveTopUsers);

  const users = Array.isArray(topUsers) ? topUsers : [];
  if (users.length === 0) {
    return null;
  }


  return (
    <Box sx={{ py: 8, bgcolor: "#fff" }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography variant="overline" sx={{ color: "primary.main", fontWeight: 800, letterSpacing: 2 }}>
            COMMUNITY & VIP REVIEWS
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1.5 }}>
            Loved by Our Esteemed Guests
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
            See what world travelers, gastronomes, and food critics say about their unforgettable Burak dining experience.
          </Typography>
        </Box>

        {/* Users Grid */}
        <Grid container spacing={3.5}>
          {users.slice(0, 3).map((user) => (
            <Grid key={user._id} size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 4,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid #e2e8f0",
                  position: "relative",
                  boxShadow: "0 4px 16px rgba(15, 23, 42, 0.04)",
                }}
              >
                <FormatQuoteIcon sx={{ position: "absolute", top: 20, right: 20, color: "rgba(245, 158, 11, 0.2)", fontSize: 44 }} />

                <CardContent sx={{ p: 0, display: "flex", flexDirection: "column", height: "100%" }}>
                  <Rating value={5} readOnly size="small" sx={{ color: "#f59e0b", mb: 2 }} />
                  <Typography variant="body1" sx={{ color: "#334155", fontStyle: "italic", mb: 3, flexGrow: 1, lineHeight: 1.7 }}>
                    "{user.memberDesc || "Exceptional dining experience, authentic flavors and outstanding guest hospitality!"}"
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, pt: 2, borderTop: "1px solid #f1f5f9" }}>
                    <Avatar
                      src={getImageUrl(user.memberImage)}
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor: "#f59e0b",
                        color: "#000",
                        fontWeight: 800,
                      }}
                    >
                      {user.memberNick?.[0]?.toUpperCase() || "U"}
                    </Avatar>
                    <div>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                          {user.memberNick}
                        </Typography>
                        <VerifiedIcon sx={{ fontSize: 16, color: "#3b82f6" }} />
                      </Box>
                      <Chip
                        label={`${user.memberPoints || 0} Burak Points`}
                        size="small"
                        sx={{ fontSize: "0.68rem", height: 20, bgcolor: "rgba(245, 158, 11, 0.12)", color: "#d97706", fontWeight: 700, mt: 0.5 }}
                      />
                    </div>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
