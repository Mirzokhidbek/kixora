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
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

/** REDUX DISPATCH SETUP **/
const actionDispatch = (dispatch: Dispatch) => ({
  setPausedOrders: (data: any[]) => dispatch(setPausedOrders(data)),
  setProcessOrders: (data: any[]) => dispatch(setProcessOrders(data)),
  setFinishedOrders: (data: any[]) => dispatch(setFinishedOrders(data)),
});

export function OrdersPage() {
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
        .getMyOrders({ page: 1, limit: 10, orderStatus: OrderStatus.PAUSE })
        .then((data) => setPausedOrders(data))
        .catch((err) => console.log("Paused orders error:", err));

      // 2. Process Orders
      orderService
        .getMyOrders({ page: 1, limit: 10, orderStatus: OrderStatus.PROCESS })
        .then((data) => setProcessOrders(data))
        .catch((err) => console.log("Process orders error:", err));

      // 3. Finished Orders
      orderService
        .getMyOrders({ page: 1, limit: 10, orderStatus: OrderStatus.FINISH })
        .then((data) => setFinishedOrders(data))
        .catch((err) => console.log("Finished orders error:", err));
    }
  }, [authMember, orderBuilder, setPausedOrders, setProcessOrders, setFinishedOrders]);

  return (
    <Box sx={{ py: 6, minHeight: "85vh" }}>
      <Container maxWidth="lg">
        {/* Header Title */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
            <ReceiptLongIcon sx={{ fontSize: 32, color: "primary.main" }} />
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              Order Management & Tracking
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            View pending payments, live cooking stages, and receipt history of your dining orders.
          </Typography>
        </Box>

        {!authMember ? (
          <Card
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 4,
              bgcolor: "#0f172a",
              color: "#fff",
              border: "1px solid rgba(245, 158, 11, 0.2)",
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 50, color: "#f59e0b", mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
              VIP Authentication Required
            </Typography>
            <Typography variant="body2" sx={{ color: "#94a3b8", mb: 3, maxWidth: 450, mx: "auto" }}>
              Please sign in with your VIP Burak account to view and manage your live kitchen orders and receipts.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ borderRadius: 3, px: 4, fontWeight: 800 }}
              onClick={() => (window.location.href = "/")}
            >
              Go to Home & Sign In
            </Button>
          </Card>
        ) : (
          <>
            {/* Tab Selection */}
            <Tabs
              value={tabIndex}
              onChange={(_, newVal) => setTabIndex(newVal)}
              sx={{
                borderBottom: "1px solid #e2e8f0",
                "& .MuiTabs-indicator": { backgroundColor: "#f59e0b", height: 3 },
                "& .MuiTab-root": {
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: "#64748b",
                  "&.Mui-selected": { color: "#0f172a" },
                },
              }}
            >
              <Tab label={`PAUSED ORDERS (${pausedOrders.length})`} />
              <Tab label={`PROCESS ORDERS (${processOrders.length})`} />
              <Tab label={`FINISHED ORDERS (${finishedOrders.length})`} />
            </Tabs>

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
