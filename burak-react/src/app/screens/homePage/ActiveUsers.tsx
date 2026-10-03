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
import { serverApi } from "../../../lib/config";

export function ActiveUsers() {
  const topUsers = useSelector(retrieveTopUsers);

  const defaultUsers = [
    {
      _id: "u-1",
      memberNick: "Alexandr Petrov",
      memberPoints: 850,
      memberDesc: "The 45-day dry-aged Tomahawk show is unbelievable. The texture and butter aroma are unmatched!",
      memberImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    },
    {
      _id: "u-2",
      memberNick: "Malika Karimova",
      memberPoints: 620,
      memberDesc: "Baklava with fresh Gaziantep pistachios and Maraş ice cream is the best dessert in town.",
      memberImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    },
    {
      _id: "u-3",
      memberNick: "Sardor Rakhimov",
      memberPoints: 490,
      memberDesc: "Fast VIP delivery, food arrived piping hot in thermal packaging. 10/10 service!",
      memberImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    },
  ];

  const users = topUsers.length ? topUsers : defaultUsers;

  const getImageSrc = (img?: string) => {
    if (!img) return "";
    return img.startsWith("http") ? img : `${serverApi}/${img}`;
  };

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
                      src={getImageSrc(user.memberImage)}
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
