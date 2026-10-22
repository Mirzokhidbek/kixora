import { Box, Button, Dialog, IconButton, Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export type PolicyType = "terms" | "privacy";

/** Terms of Service / Privacy Policy dialog */
export function PolicyDialog({ type, onClose }: { type: PolicyType | null; onClose: () => void }) {
  return (
    <Dialog
      open={Boolean(type)}
      onClose={() => onClose()}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: "16px",
            bgcolor: "#ffffff",
            color: "#111827",
            p: 3,
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.25)",
          },
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, pb: 1, borderBottom: "1px solid #f3f4f6" }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "#111827", fontSize: "1.1rem" }}>
          {type === "terms" ? "KIXORA Terms of Service" : "KIXORA Privacy Policy"}
        </Typography>
        <IconButton onClick={() => onClose()} size="small" sx={{ color: "#6b7280" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ maxHeight: 360, overflowY: "auto", pr: 1 }}>
        {type === "terms" ? (
          <Stack spacing={2} sx={{ color: "#4b5563", fontSize: "0.85rem", lineHeight: 1.7 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#111827", mb: 0.3 }}>
                1. Acceptance of Terms
              </Typography>
              <Typography variant="body2" sx={{ color: "#4b5563", fontSize: "0.82rem" }}>
                By creating an account or placing orders on KIXORA, you agree to comply with our authentic luxury footwear purchase conditions and verified membership protocols.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#111827", mb: 0.3 }}>
                2. 100% Authentic Footwear Guarantee
              </Typography>
              <Typography variant="body2" sx={{ color: "#4b5563", fontSize: "0.82rem" }}>
                Every pair of sneakers, boots, and athletic footwear available on KIXORA is rigorously inspected for authenticity and certified by manufacturer serial numbers.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#111827", mb: 0.3 }}>
                3. 30-Day Free Returns & Exchanges
              </Typography>
              <Typography variant="body2" sx={{ color: "#4b5563", fontSize: "0.82rem" }}>
                Items may be returned or exchanged within 30 days of delivery, provided they are in unworn, brand-new condition with all original packaging intact.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#111827", mb: 0.3 }}>
                4. Express Global Shipping
              </Typography>
              <Typography variant="body2" sx={{ color: "#4b5563", fontSize: "0.82rem" }}>
                Complimentary express shipping is provided on all orders exceeding $100 with full real-time courier tracking.
              </Typography>
            </Box>
          </Stack>
        ) : (
          <Stack spacing={2} sx={{ color: "#4b5563", fontSize: "0.85rem", lineHeight: 1.7 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#111827", mb: 0.3 }}>
                1. Data Protection & Encryption
              </Typography>
              <Typography variant="body2" sx={{ color: "#4b5563", fontSize: "0.82rem" }}>
                Connections to KIXORA use HTTPS (TLS) encryption to protect your login credentials, shipping address, and personal account information.
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#111827", mb: 0.3 }}>
                2. Payments
              </Typography>
              <Typography variant="body2" sx={{ color: "#4b5563", fontSize: "0.82rem" }}>
                KIXORA does not collect or store card details. Online card payments are not offered yet; payments are confirmed by the store (for example on delivery or by bank transfer).
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#111827", mb: 0.3 }}>
                3. Privacy & Zero Third-Party Selling
              </Typography>
              <Typography variant="body2" sx={{ color: "#4b5563", fontSize: "0.82rem" }}>
                Your personal data is strictly used for order fulfillment and VIP drop announcements. We never sell or distribute your private information to third parties.
              </Typography>
            </Box>
          </Stack>
        )}
      </Box>

      <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid #f3f4f6", textAlign: "right" }}>
        <Button
          variant="contained"
          onClick={() => onClose()}
          sx={{
            bgcolor: "#000000",
            color: "#ffffff",
            borderRadius: "8px",
            px: 3,
            fontWeight: 700,
            fontSize: "0.82rem",
            textTransform: "none",
            "&:hover": { bgcolor: "#262626" },
          }}
        >
          I Understand
        </Button>
      </Box>
    </Dialog>
  );
}
