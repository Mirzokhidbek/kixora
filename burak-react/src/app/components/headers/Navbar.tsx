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
  Slide,
} from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

import { BasketDrawer } from "./BasketDrawer";
import type { CartItem } from "../../../lib/types/cart";
import type { Member } from "../../../lib/types/member";

interface NavbarProps {
  cartItems: CartItem[];
  onAdd: (item: any) => void;
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

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [basketOpen, setBasketOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "Menu", path: "/products" },
    { title: "Orders", path: "/orders" },
    { title: "Account", path: "/user" },
    { title: "Help", path: "/help" },
  ];

  const totalCartCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  const totalCartPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <Box sx={{ position: "sticky", top: 0, zIndex: 1200 }}>
      {/* Luxury Dark Navbar */}
      <AppBar
        position="static"
        sx={{
          bgcolor: "rgba(9, 13, 22, 0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
          py: 0.8,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            {/* Brand Logo */}
            <Box
              component={NavLink}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                textDecoration: "none",
                color: "#fff",
              }}
            >
              <Box
                sx={{
                  width: { xs: 38, md: 44 },
                  height: { xs: 38, md: 44 },
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#000",
                  boxShadow: "0 4px 16px rgba(245, 158, 11, 0.4)",
                }}
              >
                <RestaurantMenuIcon sx={{ fontSize: { xs: 22, md: 26 } }} />
              </Box>
              <div>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 900,
                    fontSize: { xs: "1.1rem", md: "1.35rem" },
                    letterSpacing: "0.02em",
                    color: "#ffffff",
                    lineHeight: 1.1,
                  }}
                >
                  BURAK <span style={{ color: "#f59e0b" }}>RESTAURANT</span>
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: { xs: "none", sm: "block" },
                    color: "#94a3b8",
                    fontSize: "0.68rem",
                    letterSpacing: 1.5,
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}
                >
                  Authentic Open-Fire Gastronomy
                </Typography>
              </div>
            </Box>

            {/* Desktop Capsule Navigation Links */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 0.8,
                background: "rgba(30, 41, 59, 0.6)",
                backdropFilter: "blur(16px)",
                px: 1.5,
                py: 0.6,
                borderRadius: 99,
                border: "1px solid rgba(255, 255, 255, 0.12)",
                boxShadow: "inset 0 1px 1px rgba(255,255,255,0.1)",
              }}
            >
              {navLinks.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.title}
                    component={NavLink}
                    to={item.path}
                    sx={{
                      color: isActive ? "#000" : "#cbd5e1",
                      fontWeight: 800,
                      fontSize: "0.9rem",
                      px: 2.2,
                      py: 0.7,
                      borderRadius: 99,
                      backgroundColor: isActive ? "#f59e0b" : "transparent",
                      boxShadow: isActive ? "0 4px 14px rgba(245, 158, 11, 0.4)" : "none",
                      transition: "all 0.25s ease",
                      "&:hover": {
                        color: isActive ? "#000" : "#ffffff",
                        backgroundColor: isActive ? "#fbbf24" : "rgba(255, 255, 255, 0.08)",
                      },
                    }}
                  >
                    {item.title}
                  </Button>
                );
              })}
            </Box>

            {/* Right Action Icons */}
            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
              {/* Cart Button */}
              <IconButton
                sx={{
                  color: "#fff",
                  background: "rgba(30, 41, 59, 0.7)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  width: { xs: 40, sm: 44 },
                  height: { xs: 40, sm: 44 },
                  "&:hover": { background: "rgba(245, 158, 11, 0.2)", color: "#f59e0b" },
                }}
                onClick={() => setBasketOpen(true)}
              >
                <Badge
                  badgeContent={totalCartCount}
                  sx={{
                    "& .MuiBadge-badge": {
                      bgcolor: "#f59e0b",
                      color: "#000",
                      fontWeight: 900,
                      boxShadow: "0 2px 6px rgba(245,158,11,0.5)",
                    },
                  }}
                >
                  <ShoppingCartOutlinedIcon fontSize="small" />
                </Badge>
              </IconButton>

              {/* User Account / Auth Capsule */}
              {member ? (
                <>
                  <Box
                    onClick={handleMenuOpen}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.2,
                      cursor: "pointer",
                      background: "rgba(30, 41, 59, 0.7)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      pl: 0.6,
                      pr: { xs: 0.6, sm: 2 },
                      py: 0.5,
                      borderRadius: 99,
                      transition: "0.2s",
                      "&:hover": { borderColor: "#f59e0b", background: "rgba(245, 158, 11, 0.1)" },
                    }}
                  >
                    <Avatar
                      src={member.memberImage}
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: "#f59e0b",
                        color: "#000",
                        fontWeight: 800,
                        fontSize: "0.85rem",
                      }}
                    >
                      {member.memberNick?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <Typography
                      variant="body2"
                      sx={{ color: "#fff", fontWeight: 700, display: { xs: "none", sm: "block" } }}
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
                          bgcolor: "#1e293b",
                          color: "#fff",
                          borderRadius: 3,
                          border: "1px solid rgba(255,255,255,0.1)",
                          minWidth: 180,
                          boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                        },
                      },
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        navigate("/user");
                      }}
                    >
                      <PersonIcon sx={{ mr: 1.5, color: "#f59e0b", fontSize: 20 }} /> Profile
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        navigate("/orders");
                      }}
                    >
                      <ShoppingCartOutlinedIcon sx={{ mr: 1.5, color: "#f59e0b", fontSize: 20 }} /> My Orders
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        onLogoutClick();
                      }}
                      sx={{ color: "#ef4444" }}
                    >
                      <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} /> Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onLoginClick}
                  sx={{ borderRadius: 99, px: { xs: 2, sm: 3 }, py: { xs: 0.6, sm: 0.8 }, fontWeight: 800, fontSize: { xs: "0.82rem", sm: "0.9rem" } }}
                >
                  Sign In
                </Button>
              )}

              {/* Mobile Menu Icon */}
              <IconButton
                sx={{ color: "#fff", display: { xs: "flex", md: "none" } }}
                onClick={() => setMobileOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Floating Cart Action Bar */}
      {totalCartCount > 0 && (
        <Slide direction="up" in={totalCartCount > 0} mountOnEnter unmountOnExit>
          <Box
            sx={{
              display: { xs: "block", md: "none" },
              position: "fixed",
              bottom: 16,
              left: 16,
              right: 16,
              zIndex: 1300,
            }}
          >
            <Box
              onClick={() => setBasketOpen(true)}
              sx={{
                bgcolor: "#0f172a",
                color: "#fff",
                p: 2,
                borderRadius: 4,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(245, 158, 11, 0.3)",
                border: "2px solid #f59e0b",
                cursor: "pointer",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Badge badgeContent={totalCartCount} color="primary">
                  <ShoppingCartOutlinedIcon sx={{ color: "#f59e0b" }} />
                </Badge>
                <div>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>
                    {totalCartCount} {totalCartCount === 1 ? "Dish" : "Dishes"} in Cart
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#f59e0b", fontWeight: 700 }}>
                    Total: ${totalCartPrice.toFixed(2)}
                  </Typography>
                </div>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#f59e0b", fontWeight: 800 }}>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  View Cart
                </Typography>
                <ArrowForwardIcon fontSize="small" />
              </Box>
            </Box>
          </Box>
        </Slide>
      )}

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        slotProps={{
          paper: {
            sx: { width: 280, bgcolor: "#090d16", color: "#fff", p: 3 },
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#000",
            }}
          >
            <RestaurantMenuIcon />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#fff" }}>
            BURAK <span style={{ color: "#f59e0b" }}>MENU</span>
          </Typography>
        </Box>

        <List>
          {navLinks.map((item) => (
            <ListItem key={item.title} disablePadding sx={{ mb: 1.2 }}>
              <ListItemButton
                component={NavLink}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: 3,
                  py: 1.2,
                  "&.active": { bgcolor: "rgba(245, 158, 11, 0.2)", color: "#f59e0b" },
                }}
              >
                <ListItemText
                  primary={
                    <Typography sx={{ fontWeight: 700, fontSize: "1.05rem", color: "inherit" }}>
                      {item.title}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Basket Drawer */}
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
    </Box>
  );
}
