import { Box, Chip, Typography } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import type { AISearchResponse } from "../../../lib/types/product";

/** Dark banner with the stylist recommendation and the extracted intent tags */
export function AIRecommendation({ result }: { result: AISearchResponse }) {
  return (
    <Box
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: "20px",
        bgcolor: "#0f172a",
        color: "#ffffff",
        mb: 3.5,
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 14px 35px rgba(15, 23, 42, 0.18)",
      }}
    >
      {/* Glow Accent */}
      <Box
        sx={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 140,
          height: 140,
          borderRadius: "50%",
          bgcolor: "rgba(99, 102, 241, 0.25)",
          filter: "blur(35px)",
          pointerEvents: "none",
        }}
      />

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.2 }}>
        <AutoAwesomeIcon sx={{ color: "#818cf8", fontSize: 18 }} />
        <Typography
          variant="caption"
          sx={{
            fontWeight: 900,
            letterSpacing: "0.1em",
            color: "#a5b4fc",
            textTransform: "uppercase",
            fontSize: "0.72rem",
          }}
        >
          KIXORA AI Recommendation
        </Typography>
      </Box>

      <Typography
        variant="body1"
        sx={{
          fontWeight: 600,
          fontSize: { xs: "0.95rem", md: "1.05rem" },
          lineHeight: 1.5,
          color: "#f8fafc",
          mb: 2,
        }}
      >
        "{result.intent?.recommendation || "Discover our curated footwear styles matching your search."}"
      </Typography>

      {/* Extracted Intent Tags */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
        {result.intent?.collection && (
          <Chip
            label={`Collection: ${result.intent.collection}`}
            size="small"
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.12)",
              color: "#e2e8f0",
              fontWeight: 700,
              fontSize: "0.72rem",
              border: "1px solid rgba(255, 255, 255, 0.15)",
            }}
          />
        )}
        {result.intent?.color && (
          <Chip
            label={`Color: ${result.intent.color}`}
            size="small"
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.12)",
              color: "#e2e8f0",
              fontWeight: 700,
              fontSize: "0.72rem",
              border: "1px solid rgba(255, 255, 255, 0.15)",
            }}
          />
        )}
        {result.intent?.keywords?.slice(0, 3).map((kw, i) => (
          <Chip
            key={i}
            label={`#${kw}`}
            size="small"
            sx={{
              bgcolor: "rgba(99, 102, 241, 0.22)",
              color: "#c7d2fe",
              fontWeight: 700,
              fontSize: "0.72rem",
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
