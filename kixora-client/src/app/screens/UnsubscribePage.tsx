import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import SupportService from "../services/SupportService";

/** Target of the unsubscribe link (signed token, so only the address owner can use it) */
export function UnsubscribePage() {
  const [params] = useSearchParams();
  const [state, setState] = useState<"working" | "done" | "error">("working");

  useEffect(() => {
    const email = params.get("email") || "";
    const token = params.get("token") || "";
    new SupportService()
      .unsubscribe(email, token)
      .then(() => setState("done"))
      .catch(() => setState("error"));
  }, [params]);

  return (
    <Container maxWidth="sm" sx={{ py: 12, textAlign: "center" }}>
      {state === "working" && <CircularProgress sx={{ color: "#111827" }} />}
      {state !== "working" && (
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
            {state === "done" ? "You have been unsubscribed" : "This link is invalid"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {state === "done"
              ? "You will no longer receive KIXORA newsletter emails."
              : "Please use the unsubscribe link from your latest email."}
          </Typography>
        </Box>
      )}
    </Container>
  );
}
