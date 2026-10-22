/**
 * ============================================================================
 * App.tsx - Root Application Component & Layout Shell
 * ============================================================================
 * - Configures Global MUI Theme & baseline styling
 * - Sets up React Router routing for all screens (Home, Products, Orders, User, Help)
 * - Manages global shopping cart state & checkout triggers
 * - Manages authentication modal and persistent login session restoration
 */

import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box, CircularProgress } from "@mui/material";
import customTheme from "./MaterialTheme/theme";

import { Navbar } from "./components/headers/Navbar";
import { Footer } from "./components/footers/Footer";
import { AuthModal } from "./components/auth/AuthModal";
import { CheckoutModal, type CheckoutRequest } from "./components/checkout/CheckoutModal";
import PaymentService from "./services/PaymentService";
import { UnsubscribePage } from "./screens/UnsubscribePage";
import { ResetPasswordPage, VerifyEmailBanner, VerifyEmailPage } from "./screens/AccountLinkPages";

// Lazy-loaded routes for optimal Lighthouse performance and smaller initial bundles
const HomePage = lazy(() => import("./screens/homePage").then(m => ({ default: m.HomePage })));
const ProductsPage = lazy(() => import("./screens/productsPage").then(m => ({ default: m.ProductsPage })));
const OrdersPage = lazy(() => import("./screens/ordersPage").then(m => ({ default: m.OrdersPage })));
const UserPage = lazy(() => import("./screens/userPage").then(m => ({ default: m.UserPage })));
const HelpPage = lazy(() => import("./screens/helpPage").then(m => ({ default: m.HelpPage })));

import { useBasket } from "./hooks/useBasket";
import { useGlobals } from "./hooks/useGlobals";
import MemberService from "./services/MemberService";
import OrderService from "./services/OrderService";
import { sweetTopSuccessAlert, sweetErrorAlert, sweetTopSmallSuccessAlert } from "../lib/sweetAlert";

export default function App() {
  const { cartItems, onAdd, onRemove, onDelete, onDeleteAll, syncCart } = useBasket();
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

  const handleCheckoutClick = async () => {
    if (!authMember) {
      sweetErrorAlert("Please sign in to place your luxury footwear order!");
      setAuthOpen(true);
      return;
    }

    if (cartItems.length === 0) {
      sweetErrorAlert("Your shopping bag is empty!");
      return;
    }

    // never check out with stale prices or sold-out items
    const notes = await syncCart();
    if (notes.length) {
      sweetErrorAlert(`Your bag was updated before checkout:\n${notes.join("\n")}`);
      if (!JSON.parse(localStorage.getItem("cart_items") || "[]").length) return;
    }
    setCheckoutOpen(true);
  };

  /**
   * Creates the order (stock is reserved, the server computes the total), then:
   * - TEST: the simulated provider confirms payment → order moves to "process"
   * - MANUAL: the order waits in "paused" until the store confirms the payment
   * The client never marks an order as paid itself.
   */
  const handleConfirmOrder = async ({ shipping, paymentMethod }: CheckoutRequest) => {
    try {
      const orderService = new OrderService();
      const createdOrder = await orderService.createOrder(cartItems, shipping);
      onDeleteAll();
      setOrderBuilder(new Date());

      let tab = "paused";
      if (paymentMethod === "TEST") {
        try {
          await new PaymentService().payWithTestProvider(createdOrder._id);
          tab = "process";
          sweetTopSuccessAlert("Order placed and test payment confirmed!", 3000);
        } catch {
          sweetErrorAlert("Order placed, but the test payment failed. You can retry from your orders.");
        }
      } else {
        sweetTopSuccessAlert("Order placed! The store will confirm your payment.", 3000);
      }
      setTimeout(() => {
        window.location.href = `/orders?tab=${tab}`;
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
            <Suspense
              fallback={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "60vh",
                    bgcolor: "#ffffff",
                  }}
                >
                  <CircularProgress size={40} sx={{ color: "#000000" }} />
                </Box>
              }
            >
              <VerifyEmailBanner />
              <Routes>
                <Route path="/" element={<HomePage onAdd={onAdd} />} />
                <Route path="/products/*" element={<ProductsPage onAdd={onAdd} />} />
                <Route path="/orders" element={<OrdersPage onLoginClick={() => setAuthOpen(true)} />} />
                <Route path="/user" element={<UserPage member={authMember} onLoginClick={() => setAuthOpen(true)} />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="/unsubscribe" element={<UnsubscribePage />} />
                <Route path="/reset-password" element={<ResetPasswordPage onLoginClick={() => setAuthOpen(true)} />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
              </Routes>
            </Suspense>
          </Box>

          <Footer />

          {/* Authentication Modal */}
          <AuthModal
            open={authOpen}
            onClose={() => setAuthOpen(false)}
            onSuccess={(member) => {
              setAuthMember(member);
              sweetTopSuccessAlert(`Welcome back, ${member?.memberNick || "Member"}! ✨`);
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
