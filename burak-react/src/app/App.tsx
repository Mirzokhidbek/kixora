import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box, Snackbar, Alert } from "@mui/material";
import customTheme from "./MaterialTheme/theme";

import { Navbar } from "./components/headers/Navbar";
import { Footer } from "./components/footers/Footer";
import { AuthModal } from "./components/auth/AuthModal";

import { HomePage } from "./screens/homePage";
import { ProductsPage } from "./screens/productsPage";
import { OrdersPage } from "./screens/ordersPage";
import { UserPage } from "./screens/userPage";
import { HelpPage } from "./screens/helpPage";

import { useBasket } from "./hooks/useBasket";
import { useGlobals } from "./context/ContextProvider";
import MemberService from "./services/MemberService";
import OrderService from "./services/OrderService";

export default function App() {
  const { cartItems, onAdd, onRemove, onDelete, onDeleteAll } = useBasket();
  const { authMember, setAuthMember, setOrderBuilder } = useGlobals();

  const [authOpen, setAuthOpen] = useState<boolean>(false);
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string>("");

  useEffect(() => {
    const memberService = new MemberService();
    memberService
      .getMemberDetail()
      .then((data) => setAuthMember(data))
      .catch(() => {
        // If cookie/token invalid, keep localStorage or reset
      });
  }, []);

  const handleLogout = async () => {
    try {
      const memberService = new MemberService();
      await memberService.logout();
      setAuthMember(null);
      setToastMsg("Successfully logged out!");
      setToastOpen(true);
    } catch (err) {
      setAuthMember(null);
    }
  };

  const handleCheckout = async () => {
    if (!authMember) {
      setAuthOpen(true);
      return;
    }

    if (cartItems.length === 0) {
      setToastMsg("Your cart is empty!");
      setToastOpen(true);
      return;
    }

    try {
      const orderService = new OrderService();
      await orderService.createOrder(cartItems);
      onDeleteAll();
      setOrderBuilder(new Date());
      setToastMsg("Order placed successfully! Redirecting to orders...");
      setToastOpen(true);
      window.location.href = "/orders";
    } catch (err: any) {
      setToastMsg(err.response?.data?.message || "Order placement failed.");
      setToastOpen(true);
    }
  };

  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <Navbar
            cartItems={cartItems}
            onAdd={onAdd}
            onRemove={onRemove}
            onDelete={onDelete}
            onDeleteAll={onDeleteAll}
            onCheckout={handleCheckout}
            member={authMember}
            onLoginClick={() => setAuthOpen(true)}
            onLogoutClick={handleLogout}
          />

          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage onAdd={onAdd} />} />
              <Route path="/products/*" element={<ProductsPage onAdd={onAdd} />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/user" element={<UserPage member={authMember} />} />
              <Route path="/help" element={<HelpPage />} />
            </Routes>
          </Box>

          <Footer />

          {/* Authentication Modal */}
          <AuthModal
            open={authOpen}
            onClose={() => setAuthOpen(false)}
            onSuccess={(member) => {
              setAuthMember(member);
              setToastMsg(`Welcome back, ${member.memberNick}!`);
              setToastOpen(true);
            }}
          />

          {/* Global Notification Toast */}
          <Snackbar
            open={toastOpen}
            autoHideDuration={3000}
            onClose={() => setToastOpen(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert severity="success" sx={{ width: "100%", borderRadius: 3, fontWeight: 700 }}>
              {toastMsg}
            </Alert>
          </Snackbar>
        </Box>
      </Router>
    </ThemeProvider>
  );
}
