import { Box, Typography, Badge } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
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
      component="nav"
      aria-label="Mobile Bottom Navigation"
      sx={{
        display: { xs: "flex", md: "none" },
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1250,
        bgcolor: "rgba(255, 255, 255, 0.96)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid #e5e7eb",
        boxShadow: "0 -4px 25px rgba(0, 0, 0, 0.08)",
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
        aria-label="Navigate to Home"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textDecoration: "none",
          color: location.pathname === "/" ? "#000000" : "#6b7280",
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

      {/* 2. Catalog */}
      <Box
        component={NavLink}
        to="/products"
        aria-label="Navigate to Catalog"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textDecoration: "none",
          color: location.pathname.startsWith("/products") ? "#000000" : "#6b7280",
          py: 0.5,
          px: 1.5,
          borderRadius: 3,
          transition: "all 0.2s ease",
          "&:active": { transform: "scale(0.92)" },
        }}
      >
        <StorefrontOutlinedIcon sx={{ fontSize: 24, mb: 0.2 }} />
        <Typography sx={{ fontSize: "0.68rem", fontWeight: 800 }}>Shop</Typography>
      </Box>

      {/* Center Floating Cart Button */}
      <Box
        role="button"
        tabIndex={0}
        aria-label="Open Shopping Cart"
        onClick={onOpenBasket}
        onKeyDown={(e) => e.key === "Enter" && onOpenBasket()}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: 48,
          height: 48,
          borderRadius: "50%",
          bgcolor: "#000000",
          color: "#ffffff",
          boxShadow: "0 6px 18px rgba(0, 0, 0, 0.35)",
          transform: "translateY(-12px)",
          cursor: "pointer",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:active": { transform: "translateY(-12px) scale(0.9)" },
        }}
      >
        <Badge
          badgeContent={totalCartCount}
          sx={{
            "& .MuiBadge-badge": {
              bgcolor: "#ffffff",
              color: "#000000",
              fontWeight: 900,
              fontSize: "0.65rem",
              minWidth: 16,
              height: 16,
              top: -2,
              right: -2,
            },
          }}
        >
          <ShoppingBagOutlinedIcon sx={{ fontSize: 22 }} />
        </Badge>
      </Box>

      {/* 3. Orders */}
      <Box
        component={NavLink}
        to="/orders"
        aria-label="Navigate to Orders"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textDecoration: "none",
          color: location.pathname === "/orders" ? "#000000" : "#6b7280",
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
        aria-label="Navigate to Profile"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textDecoration: "none",
          color: location.pathname === "/user" ? "#000000" : "#6b7280",
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
