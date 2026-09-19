import { useState } from "react";
import { Container, Typography, Box, Tabs, Tab } from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

import { PausedOrders } from "./PausedOrders";
import { ProcessOrders } from "./ProcessOrders";
import { FinishedOrders } from "./FinishedOrders";

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

export function OrdersPage() {
  const [tabIndex, setTabIndex] = useState(0);

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
          <Tab label="PAUSED ORDERS (1)" />
          <Tab label="PROCESS ORDERS (1)" />
          <Tab label="FINISHED ORDERS (1)" />
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
      </Container>
    </Box>
  );
}
