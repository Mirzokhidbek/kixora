import { Box, Typography } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";

const POPULAR_REQUESTS = [
  {
    label: "Comfortable black sneakers for daily wear",
    icon: (
      <Box
        component="span"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.1rem",
          lineHeight: 1,
        }}
      >
        👟
      </Box>
    ),
  },
  {
    label: "Lightweight running shoes for marathon & gym",
    icon: <DirectionsRunIcon sx={{ fontSize: 18, color: "#1e293b" }} />,
  },
  {
    label: "Exclusive limited drop luxury sneakers",
    icon: <ShieldOutlinedIcon sx={{ fontSize: 18, color: "#1e293b" }} />,
  },
  {
    label: "Waterproof high-ankle winter boots",
    icon: <WaterDropOutlinedIcon sx={{ fontSize: 18, color: "#1e293b" }} />,
  },
];

/** Clickable example queries */
export function AIPopularRequests({ onSelect }: { onSelect: (query: string) => void }) {
  return (
    <Box sx={{ mb: 3.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 1.6 }}>
        <AutoAwesomeIcon sx={{ fontSize: 15, color: "#475569" }} />
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            color: "#475569",
            fontSize: "0.82rem",
            letterSpacing: "0.01em",
          }}
        >
          Popular requests
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1.2,
        }}
      >
        {POPULAR_REQUESTS.map((item, idx) => (
          <Box
            key={idx}
            onClick={() => onSelect(item.label)}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1.2,
              bgcolor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: 9999,
              px: { xs: 1.8, sm: 2.2 },
              py: { xs: 0.8, sm: 0.9 },
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.02)",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                borderColor: "#0f172a",
                bgcolor: "#f8fafc",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 16px rgba(0, 0, 0, 0.06)",
                "& .arrow-icon": {
                  transform: "translateX(3px)",
                  color: "#0f172a",
                },
              },
            }}
          >
            {item.icon}
            <Typography
              sx={{
                color: "#1e293b",
                fontSize: { xs: "0.78rem", sm: "0.83rem" },
                fontWeight: 600,
                lineHeight: 1.2,
              }}
            >
              {item.label}
            </Typography>
            <ArrowForwardIcon
              className="arrow-icon"
              sx={{
                fontSize: 14,
                color: "#94a3b8",
                transition: "all 0.2s ease",
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
