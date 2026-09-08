/**
 * ============================================================================
 * App.tsx - Root Application Component & Layout Shell
 * ============================================================================
 * - Configures Global MUI Theme & baseline styling
 * - Sets up React Router routing for all screens (Home, Products, Orders, User, Help)
 * - Manages global shopping cart state & checkout triggers
 * - Manages authentication modal and persistent login session restoration
 */

import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box, Snackbar, Alert } from "@mui/material";
import customTheme from "./MaterialTheme/theme";

import { Navbar } from "./components/headers/Navbar";
import { Footer } from "./components/footers/Footer";
import { AuthModal } from "./components/auth/AuthModal";
import { CheckoutModal } from "./components/checkout/CheckoutModal";

import { HomePage } from "./screens/homePage";
import { ProductsPage } from "./screens/productsPage";
import { OrdersPage } from "./screens/ordersPage";
import { UserPage } from "./screens/userPage";
import { HelpPage } from "./screens/helpPage";

import { useBasket } from "./hooks/useBasket";
import { useGlobals } from "./hooks/useGlobals";
import MemberService from "./services/MemberService";
import OrderService from "./services/OrderService";
import { OrderStatus } from "../lib/enums/common.enum";
import { sweetTopSuccessAlert, sweetErrorAlert, sweetTopSmallSuccessAlert } from "../lib/sweetAlert";

export default function App() {
  const { cartItems, onAdd, onRemove, onDelete, onDeleteAll } = useBasket();
  const { authMember, setAuthMember, setOrderBuilder } = useGlobals();

  const [authOpen, setAuthOpen] = useState<boolean>(false);
  const [checkoutOpen, setCheckoutOpen] = useState<boolean>(false);

  useEffect(() => {
    const memberJson = localStorage.getItem("member_data");
    if (memberJson) {
      const memberService = new MemberService();
      memberService
        .getMemberDetail()
        .then((data) => setAuthMember(data))
        .catch(() => {
          // If session expired on server, clear stale localStorage
          setAuthMember(null);
        });
    }
  }, [setAuthMember]);

  const handleLogout = async () => {
    try {
      const memberService = new MemberService();
      await memberService.logout();
      setAuthMember(null);
      sweetTopSmallSuccessAlert("Successfully logged out!");
    } catch {
      setAuthMember(null);
    }
  };

  const handleCheckoutClick = () => {
    if (!authMember) {
      sweetErrorAlert("Please sign in to place your luxury footwear order!");
      setAuthOpen(true);
      return;
    }

    if (cartItems.length === 0) {
      sweetErrorAlert("Your shopping bag is empty!");
      return;
    }

    setCheckoutOpen(true);
  };

  const handleConfirmOrder = async (shippingInfo: any) => {
    try {
      const orderService = new OrderService();
      const createdOrder = await orderService.createOrder(cartItems);
      if (createdOrder?._id) {
        await orderService.updateOrder({
          orderId: createdOrder._id,
          orderStatus: OrderStatus.PROCESS,
        });
      }
      onDeleteAll();
      setOrderBuilder(new Date());
      sweetTopSuccessAlert("Luxury Order placed successfully! Tracking shipment...", 3000);
      setTimeout(() => {
        window.location.href = "/orders?tab=process";
      }, 700);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setAuthMember(null);
        sweetErrorAlert("Session expired. Please sign in again.");
        setAuthOpen(true);
      } else {
        sweetErrorAlert(err.response?.data?.message || "Order placement failed.");
        throw new Error(err.response?.data?.message || "Order placement failed.");
      }
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
            onCheckout={handleCheckoutClick}
            member={authMember}
            onLoginClick={() => setAuthOpen(true)}
            onLogoutClick={handleLogout}
          />

          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage onAdd={onAdd} />} />
              <Route path="/products/*" element={<ProductsPage onAdd={onAdd} />} />
              <Route path="/orders" element={<OrdersPage onLoginClick={() => setAuthOpen(true)} />} />
              <Route path="/user" element={<UserPage member={authMember} onLoginClick={() => setAuthOpen(true)} />} />
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
              sweetTopSuccessAlert(`Welcome back, ${member.memberNick}! ✨`);
            }}
          />

          {/* Luxury Checkout Wizard Modal */}
          <CheckoutModal
            open={checkoutOpen}
            onClose={() => setCheckoutOpen(false)}
            cartItems={cartItems}
            member={authMember}
            onConfirmOrder={handleConfirmOrder}
          />
        </Box>
      </Router>
    </ThemeProvider>
  );
}
