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
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

export function NavbarOther() {
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuth = true;
  const userNick = "Miro";

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

  return (
    <Box sx={{ position: "sticky", top: 0, zIndex: 1100 }}>
      <AppBar
        position="static"
        sx={{
          bgcolor: "#0f172a",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: "space-between", py: 0.5 }}>
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
                  width: 38,
                  height: 38,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#000",
                  boxShadow: "0 4px 12px rgba(245, 158, 11, 0.35)",
                }}
              >
                <RestaurantMenuIcon sx={{ fontSize: 22 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: "0.02em" }}>
                BURAK <span style={{ color: "#f59e0b" }}>RESTAURANT</span>
              </Typography>
            </Box>

            {/* Desktop Navigation Links */}
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
              {navLinks.map((item) => (
                <Button
                  key={item.title}
                  component={NavLink}
                  to={item.path}
                  sx={{
                    color: location.pathname === item.path ? "#f59e0b" : "#94a3b8",
                    fontWeight: 600,
                    fontSize: "0.92rem",
                    px: 2,
                    py: 0.6,
                    borderRadius: 2,
                    backgroundColor:
                      location.pathname === item.path ? "rgba(245, 158, 11, 0.12)" : "transparent",
                    "&:hover": {
                      color: "#fff",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                    },
                  }}
                >
                  {item.title}
                </Button>
              ))}
            </Box>

            {/* Right Action Icons */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton
                sx={{
                  color: "#fff",
                  "&:hover": { color: "#f59e0b" },
                }}
                onClick={() => navigate("/orders")}
              >
                <Badge badgeContent={3} color="primary">
                  <ShoppingCartOutlinedIcon />
                </Badge>
              </IconButton>

              {isAuth ? (
                <>
                  <Box
                    onClick={handleMenuOpen}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      cursor: "pointer",
                      pl: 1,
                      pr: 1.5,
                      py: 0.5,
                      borderRadius: 99,
                      border: "1px solid rgba(255,255,255,0.12)",
                      "&:hover": { borderColor: "#f59e0b" },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 30,
                        height: 30,
                        bgcolor: "primary.main",
                        color: "#000",
                        fontWeight: 700,
                        fontSize: "0.8rem",
                      }}
                    >
                      {userNick.charAt(0)}
                    </Avatar>
                    <Typography
                      variant="body2"
                      sx={{ color: "#fff", fontWeight: 600, display: { xs: "none", sm: "block" } }}
                    >
                      {userNick}
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
                        alert("Logged out");
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
                  onClick={() => navigate("/user")}
                  sx={{ borderRadius: 99, px: 3, fontWeight: 700 }}
                >
                  Sign In
                </Button>
              )}

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

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        slotProps={{
          paper: {
            sx: { width: 260, bgcolor: "#0f172a", color: "#fff", p: 3 },
          },
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800, color: "#f59e0b", mb: 3 }}>
          BURAK MENU
        </Typography>
        <List>
          {navLinks.map((item) => (
            <ListItem key={item.title} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={NavLink}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: 2,
                  "&.active": { bgcolor: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" },
                }}
              >
                <ListItemText
                  primary={
                    <Typography sx={{ fontWeight: 600, color: "inherit" }}>
                      {item.title}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}
