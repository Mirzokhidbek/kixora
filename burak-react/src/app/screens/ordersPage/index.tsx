import { useState, useEffect, useMemo } from "react";
import { Container, Typography, Box, Tabs, Tab, Button, Card } from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useDispatch, useSelector } from "react-redux";
import type { Dispatch } from "@reduxjs/toolkit";

import { PausedOrders } from "./PausedOrders";
import { ProcessOrders } from "./ProcessOrders";
import { FinishedOrders } from "./FinishedOrders";

import OrderService from "../../services/OrderService";
import { setPausedOrders, setProcessOrders, setFinishedOrders } from "./slice";
import { retrievePausedOrders, retrieveProcessOrders, retrieveFinishedOrders } from "./selector";
import { OrderStatus } from "../../../lib/enums/common.enum";
import { useGlobals } from "../../hooks/useGlobals";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3.5 }}>{children}</Box>}
    </div>
  );
}

/** REDUX DISPATCH SETUP **/
const actionDispatch = (dispatch: Dispatch) => ({
  setPausedOrders: (data: any[]) => dispatch(setPausedOrders(data)),
  setProcessOrders: (data: any[]) => dispatch(setProcessOrders(data)),
  setFinishedOrders: (data: any[]) => dispatch(setFinishedOrders(data)),
});

interface OrdersPageProps {
  onLoginClick?: () => void;
}

export function OrdersPage({ onLoginClick }: OrdersPageProps) {
  const [tabIndex, setTabIndex] = useState(0);
  const { authMember, orderBuilder } = useGlobals();

  const dispatch = useDispatch();
  const { setPausedOrders, setProcessOrders, setFinishedOrders } = useMemo(
    () => actionDispatch(dispatch),
    [dispatch]
  );

  const pausedOrders = useSelector(retrievePausedOrders);
  const processOrders = useSelector(retrieveProcessOrders);
  const finishedOrders = useSelector(retrieveFinishedOrders);

  useEffect(() => {
    if (authMember) {
      const orderService = new OrderService();

      // 1. Paused Orders
      orderService
        .getMyOrders({
          page: 1,
          limit: 10,
          orderStatus: OrderStatus.PAUSE,
        })
        .then((data) => setPausedOrders(data))
        .catch((err) => console.log("Paused orders error:", err));

      // 2. Process Orders
      orderService
        .getMyOrders({
          page: 1,
          limit: 10,
          orderStatus: OrderStatus.PROCESS,
        })
        .then((data) => setProcessOrders(data))
        .catch((err) => console.log("Process orders error:", err));

      // 3. Finished Orders
      orderService
        .getMyOrders({
          page: 1,
          limit: 10,
          orderStatus: OrderStatus.FINISH,
        })
        .then((data) => setFinishedOrders(data))
        .catch((err) => console.log("Finished orders error:", err));
    }
  }, [authMember, orderBuilder, setPausedOrders, setProcessOrders, setFinishedOrders]);

  return (
    <Box sx={{ py: 6, minHeight: "85vh", bgcolor: "#ffffff" }}>
      <Container maxWidth="lg">
        {/* Header Title */}
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 3,
              bgcolor: "rgba(245, 158, 11, 0.12)",
              color: "#f59e0b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ReceiptLongIcon sx={{ fontSize: 28 }} />
          </Box>
          <div>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#0f172a" }}>
              My Orders & Live Tracker
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track your gourmet preparations from the kitchen flame to your doorstep.
            </Typography>
          </div>
        </Box>

        {/* Conditional Content */}
        {!authMember ? (
          <Card
            sx={{
              p: { xs: 4, md: 6 },
              textAlign: "center",
              borderRadius: 5,
              border: "1px solid #f1f5f9",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
              maxWidth: 550,
              mx: "auto",
              my: 6,
            }}
          >
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: 4,
                bgcolor: "#fffbeb",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2.5,
              }}
            >
              <LockOutlinedIcon sx={{ fontSize: 36, color: "#f59e0b" }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 1.5, color: "#0f172a" }}>
              Sign In to View Orders
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", mb: 4, lineHeight: 1.7 }}>
              Please sign in with your account to view your live kitchen preparations, order progress, and receipts.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                borderRadius: 3,
                px: 5,
                py: 1.4,
                fontWeight: 800,
                bgcolor: "#eab308",
                color: "#fff",
                boxShadow: "0 8px 20px rgba(234, 179, 8, 0.4)",
                "&:hover": { bgcolor: "#ca8a04" },
              }}
              onClick={onLoginClick || (() => (window.location.href = "/"))}
            >
              Sign In to View Orders
            </Button>
          </Card>
        ) : (
          <>
            {/* Tab Selection */}
            <Box sx={{ bgcolor: "#fbfbfe", p: 1, borderRadius: 4, border: "1px solid #f1f5f9", mb: 2 }}>
              <Tabs
                value={tabIndex}
                onChange={(_, newVal) => setTabIndex(newVal)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  "& .MuiTabs-indicator": { backgroundColor: "#f59e0b", height: 3, borderRadius: 2 },
                  "& .MuiTab-root": {
                    fontWeight: 800,
                    fontSize: "0.95rem",
                    color: "#64748b",
                    "&.Mui-selected": { color: "#f59e0b" },
                  },
                }}
              >
                <Tab label={`PAUSED ORDERS (${pausedOrders.length})`} />
                <Tab label={`PROCESS ORDERS (${processOrders.length})`} />
                <Tab label={`FINISHED ORDERS (${finishedOrders.length})`} />
              </Tabs>
            </Box>

            {/* Tab Panels */}
            <TabPanel value={tabIndex} index={0}>
              <PausedOrders />
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
              <ProcessOrders />
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
              <FinishedOrders />
            </TabPanel>
          </>
        )}
      </Container>
    </Box>
  );
}
