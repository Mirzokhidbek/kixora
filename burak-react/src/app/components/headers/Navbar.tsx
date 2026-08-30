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
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

import { BasketDrawer } from "./BasketDrawer";
import { MobileBottomNav } from "./MobileBottomNav";
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
    { title: "About", path: "/help" },
    { title: "Menu", path: "/products" },
    { title: "Orders", path: "/orders" },
    { title: "Contact us", path: "/help" },
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
    <Box sx={{ position: "sticky", top: 0, zIndex: 1200, width: "100%", overflowX: "hidden" }}>
      {/* Clean White Modern Header */}
      <AppBar
        position="static"
        sx={{
          bgcolor: "#ffffff",
          color: "#0f172a",
          borderBottom: "1px solid #f1f5f9",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.04)",
          py: 0.5,
          width: "100%",
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            {/* Brand Bubble Logo (matching Asianfood template style) */}
            <Box
              component={NavLink}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                textDecoration: "none",
                minWidth: 0,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 900,
                  fontSize: { xs: "1.45rem", md: "1.9rem" },
                  letterSpacing: "-0.03em",
                  color: "#f59e0b",
                  textShadow: "0 2px 8px rgba(245, 158, 11, 0.2)",
                  whiteSpace: "nowrap",
                }}
              >
                Burak<span style={{ color: "#334155" }}>food</span>
              </Typography>
            </Box>

            {/* Center Navigation Links */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 4,
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
                      color: isActive ? "#f59e0b" : "#475569",
                      fontWeight: isActive ? 800 : 600,
                      fontSize: "0.98rem",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {item.title}
                  </NavLink>
                );
              })}
            </Box>

            {/* Right Action Icons & Login Button */}
            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.8, sm: 2.5 } }}>
              {/* Search Icon */}
              <IconButton
                onClick={() => navigate("/products")}
                sx={{ color: "#334155", p: { xs: 0.8, sm: 1 }, "&:hover": { color: "#f59e0b" } }}
              >
                <SearchIcon fontSize="small" />
              </IconButton>

              {/* Cart Button */}
              <IconButton
                sx={{ color: "#334155", p: { xs: 0.8, sm: 1 }, "&:hover": { color: "#f59e0b" } }}
                onClick={() => setBasketOpen(true)}
              >
                <Badge
                  badgeContent={totalCartCount}
                  sx={{
                    "& .MuiBadge-badge": {
                      bgcolor: "#f59e0b",
                      color: "#fff",
                      fontWeight: 800,
                    },
                  }}
                >
                  <ShoppingCartOutlinedIcon fontSize="small" />
                </Badge>
              </IconButton>

              {/* Notification Bell */}
              <IconButton
                sx={{ display: { xs: "none", sm: "flex" }, color: "#334155", "&:hover": { color: "#f59e0b" } }}
                onClick={() => navigate("/orders")}
              >
                <NotificationsNoneOutlinedIcon fontSize="small" />
              </IconButton>

              {/* User Account / Login Button */}
              {member ? (
                <>
                  <Box
                    onClick={handleMenuOpen}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.2,
                      cursor: "pointer",
                      border: "1.5px solid #e2e8f0",
                      p: 0.4,
                      pr: { xs: 0.4, sm: 1.8 },
                      borderRadius: 99,
                      transition: "0.2s",
                      "&:hover": { borderColor: "#f59e0b", bgcolor: "#fffbeb" },
                    }}
                  >
                    <Avatar
                      src={member.memberImage}
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: "#f59e0b",
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: "0.85rem",
                      }}
                    >
                      {member.memberNick?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <Typography
                      variant="body2"
                      sx={{ color: "#0f172a", fontWeight: 700, display: { xs: "none", sm: "block" } }}
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
                          color: "#0f172a",
                          borderRadius: 3,
                          border: "1px solid #e2e8f0",
                          minWidth: 180,
                          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
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
                  variant="outlined"
                  onClick={onLoginClick}
                  sx={{
                    borderRadius: 2.5,
                    px: { xs: 1.8, sm: 3 },
                    py: 0.6,
                    fontWeight: 800,
                    fontSize: { xs: "0.82rem", sm: "0.92rem" },
                    borderColor: "#f59e0b",
                    color: "#0f172a",
                    borderWidth: 1.5,
                    "&:hover": {
                      borderColor: "#d97706",
                      bgcolor: "#fffbeb",
                      borderWidth: 1.5,
                    },
                  }}
                >
                  Login
                </Button>
              )}

              {/* Mobile Menu Icon */}
              <IconButton
                sx={{ color: "#0f172a", display: { xs: "flex", md: "none" }, p: 0.8 }}
                onClick={() => setMobileOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Floating Cart Action Bar (Positioned above bottom nav) */}
      {totalCartCount > 0 && (
        <Slide direction="up" in={totalCartCount > 0} mountOnEnter unmountOnExit>
          <Box
            sx={{
              display: { xs: "block", md: "none" },
              position: "fixed",
              bottom: 72,
              left: 12,
              right: 12,
              zIndex: 1300,
            }}
          >
            <Box
              onClick={() => setBasketOpen(true)}
              sx={{
                bgcolor: "#0f172a",
                color: "#fff",
                p: 1.8,
                borderRadius: 4,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 12px 30px rgba(0,0,0,0.35), 0 0 20px rgba(245, 158, 11, 0.35)",
                border: "2px solid #f59e0b",
                cursor: "pointer",
                transition: "transform 0.2s ease",
                "&:active": { transform: "scale(0.98)" },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Badge badgeContent={totalCartCount} color="primary">
                  <ShoppingCartOutlinedIcon sx={{ color: "#f59e0b" }} />
                </Badge>
                <div>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>
                    {totalCartCount} {totalCartCount === 1 ? "Dish" : "Dishes"}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#f59e0b", fontWeight: 800 }}>
                    Total: ${totalCartPrice.toFixed(2)}
                  </Typography>
                </div>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#f59e0b", fontWeight: 800 }}>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>
                  Checkout
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
            sx: { width: 280, bgcolor: "#ffffff", color: "#0f172a", p: 3 },
          },
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 900, color: "#f59e0b", mb: 3 }}>
          Burak<span style={{ color: "#334155" }}>food</span>
        </Typography>

        <List>
          {navLinks.map((item) => (
            <ListItem key={item.title} disablePadding sx={{ mb: 1.2 }}>
              <ListItemButton
                component={NavLink}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  "&.active": { bgcolor: "#fffbeb", color: "#f59e0b" },
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

      {/* Native App-Style Mobile Bottom Navigation Dock */}
      <MobileBottomNav
        cartItems={cartItems}
        onOpenBasket={() => setBasketOpen(true)}
      />

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
