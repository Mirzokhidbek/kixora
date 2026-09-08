import { Box, Typography, Badge } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import RestaurantMenuOutlinedIcon from "@mui/icons-material/RestaurantMenuOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { NavLink, useLocation } from "react-router-dom";
import type { CartItem } from "../../../lib/types/cart";

interface MobileBottomNavProps {
  cartItems: CartItem[];
  onOpenBasket: () => void;
}

export function MobileBottomNav({ cartItems, onOpenBasket }: MobileBottomNavProps) {
  const location = useLocation();

  const totalCartCount = cartItems.reduce((count, item) => count + item.quantity, 0);



  return (
    <Box
      sx={{
        display: { xs: "flex", md: "none" },
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1250,
        bgcolor: "rgba(255, 255, 255, 0.94)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid #f1f5f9",
        boxShadow: "0 -4px 25px rgba(0, 0, 0, 0.06)",
        px: 1.5,
        py: 0.8,
        justifyContent: "space-around",
        alignItems: "center",
        paddingBottom: "max(8px, env(safe-area-inset-bottom))",
      }}
    >
      {/* 1. Home */}
      <Box
        component={NavLink}
        to="/"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textDecoration: "none",
          color: location.pathname === "/" ? "#f59e0b" : "#64748b",
          py: 0.5,
          px: 1.5,
          borderRadius: 3,
          transition: "all 0.2s ease",
          "&:active": { transform: "scale(0.92)" },
        }}
      >
        <HomeOutlinedIcon sx={{ fontSize: 24, mb: 0.2 }} />
        <Typography sx={{ fontSize: "0.68rem", fontWeight: 800 }}>Home</Typography>
      </Box>

      {/* 2. Menu */}
      <Box
        component={NavLink}
        to="/products"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textDecoration: "none",
          color: location.pathname.startsWith("/products") ? "#f59e0b" : "#64748b",
          py: 0.5,
          px: 1.5,
          borderRadius: 3,
          transition: "all 0.2s ease",
          "&:active": { transform: "scale(0.92)" },
        }}
      >
        <RestaurantMenuOutlinedIcon sx={{ fontSize: 24, mb: 0.2 }} />
        <Typography sx={{ fontSize: "0.68rem", fontWeight: 800 }}>Menu</Typography>
      </Box>

      {/* Center Floating Cart Button */}
      <Box
        onClick={onOpenBasket}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: 50,
          height: 50,
          borderRadius: "50%",
          bgcolor: "#f59e0b",
          color: "#ffffff",
          boxShadow: "0 6px 18px rgba(245, 158, 11, 0.45)",
          transform: "translateY(-14px)",
          cursor: "pointer",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:active": { transform: "translateY(-14px) scale(0.9)" },
        }}
      >
        <Badge
          badgeContent={totalCartCount}
          sx={{
            "& .MuiBadge-badge": {
              bgcolor: "#0f172a",
              color: "#fff",
              fontWeight: 900,
              fontSize: "0.65rem",
              minWidth: 16,
              height: 16,
              top: -2,
              right: -2,
            },
          }}
        >
          <ShoppingBagOutlinedIcon sx={{ fontSize: 24 }} />
        </Badge>
      </Box>

      {/* 3. Orders */}
      <Box
        component={NavLink}
        to="/orders"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textDecoration: "none",
          color: location.pathname === "/orders" ? "#f59e0b" : "#64748b",
          py: 0.5,
          px: 1.5,
          borderRadius: 3,
          transition: "all 0.2s ease",
          "&:active": { transform: "scale(0.92)" },
        }}
      >
        <ReceiptLongOutlinedIcon sx={{ fontSize: 24, mb: 0.2 }} />
        <Typography sx={{ fontSize: "0.68rem", fontWeight: 800 }}>Orders</Typography>
      </Box>

      {/* 4. Account */}
      <Box
        component={NavLink}
        to="/user"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textDecoration: "none",
          color: location.pathname === "/user" ? "#f59e0b" : "#64748b",
          py: 0.5,
          px: 1.5,
          borderRadius: 3,
          transition: "all 0.2s ease",
          "&:active": { transform: "scale(0.92)" },
        }}
      >
        <PersonOutlineOutlinedIcon sx={{ fontSize: 24, mb: 0.2 }} />
        <Typography sx={{ fontSize: "0.68rem", fontWeight: 800 }}>Account</Typography>
      </Box>
    </Box>
  );
}
