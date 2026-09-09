import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

import { BasketDrawer } from "./BasketDrawer";
import { WishlistDrawer } from "./WishlistDrawer";
import { MobileBottomNav } from "./MobileBottomNav";
import { useWishlist } from "../../hooks/useWishlist";
import type { CartItem } from "../../../lib/types/cart";
import type { Member } from "../../../lib/types/member";

interface NavbarProps {
  cartItems: CartItem[];
  onAdd: (item: any, quantity?: number, size?: number, color?: string) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
  onCheckout: () => void;
  member: Member | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

export function Navbar({
  cartItems,
  onAdd,
  onRemove,
  onDelete,
  onDeleteAll,
  onCheckout,
  member,
  onLoginClick,
  onLogoutClick,
}: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { wishlist, wishlistCount, removeFromWishlist, clearWishlist } = useWishlist();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [basketOpen, setBasketOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "Shop", path: "/products" },
    { title: "New Arrivals", path: "/products" },
    { title: "About", path: "/user" },
    { title: "Contact", path: "/help" },
  ];

  const totalCartCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  return (
    <Box sx={{ position: "sticky", top: 0, zIndex: 1200, width: "100%" }}>
      {/* Top Banner Notice */}
      <Box
        sx={{
          bgcolor: "#000000",
          color: "#ffffff",
          py: 0.75,
          textAlign: "center",
          fontSize: "0.78rem",
          fontWeight: 600,
          letterSpacing: "0.05em",
        }}
      >
        COMPLIMENTARY EXPRESS SHIPPING ON ORDERS OVER $100 &bull; 30-DAY RETURNS
      </Box>

      {/* Main Luxury Header */}
      <AppBar
        position="static"
        sx={{
          bgcolor: "#ffffff",
          color: "#111827",
          borderBottom: "1px solid #e5e7eb",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
          py: 0.5,
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          <Toolbar disableGutters sx={{ justifyContent: "space-between", minHeight: 70 }}>
            {/* Brand Logo */}
            <Box
              component={NavLink}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                textDecoration: "none",
              }}
            >
              <Box
                component="img"
                src="/img/kixora/logo.png"
                alt="KIXORA"
                sx={{
                  height: { xs: 36, md: 44 },
                  width: "auto",
                  objectFit: "contain",
                }}
              />
            </Box>

            {/* Center Navigation Links */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 4.5,
              }}
            >
              {navLinks.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.title}
                    to={item.path}
                    style={{
                      textDecoration: "none",
                      color: isActive ? "#000000" : "#4b5563",
                      fontWeight: isActive ? 800 : 600,
                      fontSize: "0.92rem",
                      letterSpacing: "0.02em",
                      position: "relative",
                      padding: "6px 0",
                    }}
                  >
                    {item.title}
                    {isActive && (
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: "2px",
                          bgcolor: "#000000",
                          borderRadius: 1,
                        }}
                      />
                    )}
                  </NavLink>
                );
              })}
            </Box>

            {/* Right Action Icons & Login Button */}
            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
              {/* Search Icon */}
              <IconButton
                aria-label="Search footwear products"
                onClick={() => navigate("/products")}
                sx={{
                  color: "#111827",
                  p: 1,
                  "&:hover": { bgcolor: "#f3f4f6" },
                }}
              >
                <SearchIcon fontSize="small" />
              </IconButton>

              {/* Shopping Bag Icon */}
              <IconButton
                aria-label="Open shopping bag"
                sx={{
                  color: "#111827",
                  p: 1,
                  "&:hover": { bgcolor: "#f3f4f6" },
                }}
                onClick={() => setBasketOpen(true)}
              >
                <Badge
                  badgeContent={totalCartCount}
                  sx={{
                    "& .MuiBadge-badge": {
                      bgcolor: "#000000",
                      color: "#ffffff",
                      fontWeight: 800,
                      fontSize: "0.7rem",
                      minWidth: 18,
                      height: 18,
                    },
                  }}
                >
                  <ShoppingBagOutlinedIcon fontSize="small" />
                </Badge>
              </IconButton>

              {/* User Account / Sign In */}
              {member ? (
                <>
                  <Box
                    onClick={handleMenuOpen}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.2,
                      cursor: "pointer",
                      border: "1px solid #e5e7eb",
                      p: 0.5,
                      pr: { xs: 0.5, sm: 1.8 },
                      borderRadius: 9999,
                      transition: "0.2s",
                      "&:hover": { borderColor: "#000000", bgcolor: "#f9fafb" },
                    }}
                  >
                    <Avatar
                      src={member.memberImage}
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: "#111827",
                        color: "#ffffff",
                        fontWeight: 800,
                        fontSize: "0.85rem",
                      }}
                    >
                      {member.memberNick?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <Typography
                      variant="body2"
                      sx={{ color: "#111827", fontWeight: 700, display: { xs: "none", sm: "block" } }}
                    >
                      {member.memberNick}
                    </Typography>
                  </Box>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    sx={{ mt: 1.5 }}
                    slotProps={{
                      paper: {
                        sx: {
                          bgcolor: "#ffffff",
                          color: "#111827",
                          borderRadius: 3,
                          border: "1px solid #e5e7eb",
                          minWidth: 210,
                          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                          p: 1,
                        },
                      },
                    }}
                  >
                    <Box sx={{ px: 1.5, py: 1, borderBottom: "1px solid #f3f4f6", mb: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#111827", lineHeight: 1.2 }}>
                        {member.memberNick}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#6b7280", display: "block", mt: 0.2 }}>
                        {member.memberEmail || member.memberPhone || ""}
                      </Typography>
                    </Box>
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        navigate("/user");
                      }}
                      sx={{ borderRadius: 2, fontWeight: 600, fontSize: "0.88rem", py: 1 }}
                    >
                      <PersonOutlineOutlinedIcon sx={{ mr: 1.5, fontSize: 19 }} /> My Profile
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        navigate("/orders");
                      }}
                      sx={{ borderRadius: 2, fontWeight: 600, fontSize: "0.9rem", py: 1 }}
                    >
                      <LocalMallOutlinedIcon sx={{ mr: 1.5, fontSize: 20 }} /> My Orders
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        onLogoutClick();
                      }}
                      sx={{ borderRadius: 2, fontWeight: 600, fontSize: "0.9rem", py: 1, color: "#ef4444" }}
                    >
                      <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} /> Sign Out
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  variant="contained"
                  onClick={onLoginClick}
                  sx={{
                    bgcolor: "#000000",
                    color: "#ffffff",
                    borderRadius: 9999,
                    px: { xs: 2, sm: 3 },
                    py: 0.8,
                    fontWeight: 700,
                    fontSize: { xs: "0.82rem", sm: "0.88rem" },
                    textTransform: "none",
                    boxShadow: "none",
                    "&:hover": {
                      bgcolor: "#262626",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  Sign In
                </Button>
              )}

              {/* Mobile Menu Trigger */}
              <IconButton
                aria-label="Toggle navigation menu"
                sx={{ color: "#111827", display: { xs: "flex", md: "none" }, p: 0.8 }}
                onClick={() => setMobileOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer Menu */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        slotProps={{
          paper: {
            sx: { width: 290, bgcolor: "#ffffff", color: "#111827", p: 3 },
          },
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: "0.08em" }}>
            KIXORA
          </Typography>
          <Typography variant="caption" sx={{ color: "#6b7280", letterSpacing: "0.2em", fontWeight: 700 }}>
            STEP INTO MORE
          </Typography>
        </Box>

        <List>
          {navLinks.map((item) => (
            <ListItem key={item.title} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={NavLink}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  "&.active": { bgcolor: "#f3f4f6", fontWeight: 800 },
                }}
              >
                <ListItemText
                  primary={
                    <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
                      {item.title}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        cartItems={cartItems}
        onOpenBasket={() => setBasketOpen(true)}
      />

      {/* Cart Drawer */}
      <BasketDrawer
        open={basketOpen}
        onClose={() => setBasketOpen(false)}
        cartItems={cartItems}
        onAdd={onAdd}
        onRemove={onRemove}
        onDelete={onDelete}
        onDeleteAll={onDeleteAll}
        onCheckout={() => {
          setBasketOpen(false);
          onCheckout();
        }}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        open={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        wishlist={wishlist}
        onRemove={removeFromWishlist}
        onClear={clearWishlist}
        onAddToCart={onAdd}
      />
    </Box>
  );
}
