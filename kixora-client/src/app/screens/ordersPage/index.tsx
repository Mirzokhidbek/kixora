import { useState, useEffect, useMemo } from "react";
import { Container, Typography, Box, Tabs, Tab, Button, Card } from "@mui/material";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useDispatch, useSelector } from "react-redux";
import type { Dispatch } from "@reduxjs/toolkit";
import { useLocation, useNavigate } from "react-router-dom";

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
  const location = useLocation();
  const navigate = useNavigate();

  const getInitialTab = () => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab === "process") return 1;
    if (tab === "finish") return 2;
    return 0;
  };

  const [tabIndex, setTabIndex] = useState(getInitialTab);
  const { authMember, orderBuilder } = useGlobals();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab === "process") setTabIndex(1);
    else if (tab === "finish") setTabIndex(2);
    else if (tab === "paused") setTabIndex(0);
  }, [location.search]);

  const dispatch = useDispatch();
  const { setPausedOrders, setProcessOrders, setFinishedOrders } = useMemo(
    () => actionDispatch(dispatch),
    [dispatch]
  );

  const pausedOrders = useSelector(retrievePausedOrders);
  const processOrders = useSelector(retrieveProcessOrders);
  const finishedOrders = useSelector(retrieveFinishedOrders);

  // "Show more" paging per tab (previously only the latest 10 orders were reachable)
  const PAGE_SIZE = 10;
  const [pages, setPages] = useState({ PAUSE: 1, PROCESS: 1, FINISH: 1 });
  const [hasMore, setHasMore] = useState({ PAUSE: false, PROCESS: false, FINISH: false });

  useEffect(() => {
    if (!authMember) return;
    const orderService = new OrderService();
    setPages({ PAUSE: 1, PROCESS: 1, FINISH: 1 });
    const load = (status: OrderStatus) => orderService.getMyOrders({ page: 1, limit: PAGE_SIZE, orderStatus: status });

    load(OrderStatus.PAUSE)
      .then((data) => {
        setPausedOrders(data);
        setHasMore((h) => ({ ...h, PAUSE: data.length === PAGE_SIZE }));
      })
      .catch((err) => console.log("Paused orders error:", err));

    load(OrderStatus.PROCESS)
      .then((data) => {
        setProcessOrders(data);
        setHasMore((h) => ({ ...h, PROCESS: data.length === PAGE_SIZE }));
        const params = new URLSearchParams(location.search);
        if (!params.get("tab") && data.length > 0 && pausedOrders.length === 0) {
          setTabIndex(1);
        }
      })
      .catch((err) => console.log("Process orders error:", err));

    load(OrderStatus.FINISH)
      .then((data) => {
        setFinishedOrders(data);
        setHasMore((h) => ({ ...h, FINISH: data.length === PAGE_SIZE }));
      })
      .catch((err) => console.log("Finished orders error:", err));
  }, [authMember, orderBuilder, setPausedOrders, setProcessOrders, setFinishedOrders]);

  const loadMore = async (status: "PAUSE" | "PROCESS" | "FINISH") => {
    const nextPage = pages[status] + 1;
    const data = await new OrderService().getMyOrders({ page: nextPage, limit: PAGE_SIZE, orderStatus: status as OrderStatus });
    const current = { PAUSE: pausedOrders, PROCESS: processOrders, FINISH: finishedOrders }[status];
    const setter = { PAUSE: setPausedOrders, PROCESS: setProcessOrders, FINISH: setFinishedOrders }[status];
    setter([...current, ...data]);
    setPages((p) => ({ ...p, [status]: nextPage }));
    setHasMore((h) => ({ ...h, [status]: data.length === PAGE_SIZE }));
  };

  const showMore = (status: "PAUSE" | "PROCESS" | "FINISH") =>
    hasMore[status] ? (
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Button variant="outlined" onClick={() => loadMore(status)} sx={{ borderRadius: 9999, color: "#111827", borderColor: "#d1d5db", textTransform: "none", fontWeight: 700 }}>
          Show more orders
        </Button>
      </Box>
    ) : null;

  const handleTabChange = (_: any, newVal: number) => {
    setTabIndex(newVal);
    const tabMap = ["paused", "process", "finish"];
    navigate(`/orders?tab=${tabMap[newVal]}`, { replace: true });
  };

  return (
    <Box sx={{ py: 6, minHeight: "85vh", bgcolor: "#fbfbfe" }}>
      <Container maxWidth="lg">
        {/* Header Title */}
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: "14px",
              bgcolor: "#050505",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LocalShippingOutlinedIcon sx={{ fontSize: 28 }} />
          </Box>
          <div>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#0f172a", fontFamily: '"Outfit", sans-serif' }}>
              My Orders & Live Tracker
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track your luxury footwear orders and white-glove delivery in real time.
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
                bgcolor: "#f3f4f6",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2.5,
              }}
            >
              <LockOutlinedIcon sx={{ fontSize: 36, color: "#111827" }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 1.5, color: "#0f172a" }}>
              Sign In to View Orders
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", mb: 4, lineHeight: 1.7 }}>
              Please sign in with your account to view your footwear orders, real-time shipment status, and receipts.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                borderRadius: 3,
                px: 5,
                py: 1.4,
                fontWeight: 800,
                bgcolor: "#111827",
                color: "#fff",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                "&:hover": { bgcolor: "#000000" },
              }}
              onClick={onLoginClick || (() => (window.location.href = "/"))}
            >
              Sign In to View Orders
            </Button>
          </Card>
        ) : (
          <>
            {/* Tab Selection */}
            <Box sx={{ bgcolor: "#ffffff", p: 1, borderRadius: 3, border: "1px solid #e5e7eb", mb: 2 }}>
              <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  "& .MuiTabs-indicator": { backgroundColor: "#111827", height: 3, borderRadius: 2 },
                  "& .MuiTab-root": {
                    fontWeight: 800,
                    fontSize: "0.9rem",
                    color: "#6b7280",
                    "&.Mui-selected": { color: "#111827" },
                  },
                }}
              >
                <Tab label={`PENDING PAYMENT (${pausedOrders.length})`} />
                <Tab label={`ACTIVE SHIPMENTS (${processOrders.length})`} />
                <Tab label={`DELIVERED (${finishedOrders.length})`} />
              </Tabs>
            </Box>

            {/* Tab Panels */}
            <TabPanel value={tabIndex} index={0}>
              <PausedOrders />
              {showMore("PAUSE")}
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
              <ProcessOrders />
              {showMore("PROCESS")}
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
              <FinishedOrders />
              {showMore("FINISH")}
            </TabPanel>
          </>
        )}
      </Container>
    </Box>
  );
}
