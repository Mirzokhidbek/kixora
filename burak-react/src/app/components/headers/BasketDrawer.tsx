import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Avatar,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import type { CartItem } from "../../../lib/types/cart";
import { serverApi } from "../../../lib/config";

interface BasketDrawerProps {
  open: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onAdd: (item: any) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
  onCheckout: () => void;
}

export function BasketDrawer({
  open,
  onClose,
  cartItems,
  onAdd,
  onRemove,
  onDelete,
  onDeleteAll,
  onCheckout,
}: BasketDrawerProps) {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const delivery = subtotal > 0 && subtotal < 100 ? 5 : 0;
  const grandTotal = subtotal + delivery;

  const getImageSrc = (img: string) => {
    if (!img) return "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=150&q=80";
    return img.startsWith("http") ? img : `${serverApi}/${img}`;
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", sm: 400 },
            bgcolor: "#0f172a",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <ShoppingBagIcon sx={{ color: "#f59e0b" }} />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Order Basket ({cartItems.length})
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "#94a3b8" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Cart Items List */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2.5 }}>
        {cartItems.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <ShoppingBagIcon sx={{ fontSize: 60, color: "rgba(255,255,255,0.15)", mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Your Basket is Empty
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Explore our chef's signature dishes and add your favorites!
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {cartItems.map((item) => (
              <Box
                key={item._id}
                sx={{
                  display: "flex",
                  gap: 2,
                  bgcolor: "rgba(255,255,255,0.04)",
                  p: 1.5,
                  borderRadius: 3,
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <Avatar
                  src={getImageSrc(item.image)}
                  variant="rounded"
                  sx={{ width: 64, height: 64, borderRadius: 2 }}
                />

                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {item.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#f59e0b", fontWeight: 800, fontSize: "0.85rem" }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        bgcolor: "rgba(255,255,255,0.08)",
                        borderRadius: 2,
                      }}
                    >
                      <IconButton size="small" onClick={() => onRemove(item)} sx={{ color: "#fff", p: 0.5 }}>
                        <RemoveIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                      <Typography sx={{ px: 1, fontWeight: 700, fontSize: "0.85rem" }}>
                        {item.quantity}
                      </Typography>
                      <IconButton size="small" onClick={() => onAdd({ _id: item._id, productName: item.name, productPrice: item.price, productImages: [item.image] } as any)} sx={{ color: "#fff", p: 0.5 }}>
                        <AddIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Box>

                    <IconButton size="small" onClick={() => onDelete(item)} sx={{ color: "#ef4444" }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ))}

            <Button
              size="small"
              color="error"
              onClick={onDeleteAll}
              sx={{ alignSelf: "flex-end", textTransform: "none", fontSize: "0.8rem", mt: 1 }}
            >
              Clear Entire Cart
            </Button>
          </Box>
        )}
      </Box>

      {/* Footer & Checkout */}
      {cartItems.length > 0 && (
        <Box sx={{ p: 3, borderTop: "1px solid rgba(255,255,255,0.1)", bgcolor: "#090d16" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" sx={{ color: "#94a3b8" }}>
              Subtotal:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              ${subtotal.toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
            <Typography variant="body2" sx={{ color: "#94a3b8" }}>
              Delivery Fee:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: delivery === 0 ? "#10b981" : "#fff" }}>
              {delivery === 0 ? "FREE" : `$${delivery.toFixed(2)}`}
            </Typography>
          </Box>

          <Divider sx={{ my: 1.5, borderColor: "rgba(255,255,255,0.1)" }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              Grand Total:
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#f59e0b" }}>
              ${grandTotal.toFixed(2)}
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={onCheckout}
            sx={{
              py: 1.4,
              borderRadius: 3,
              fontWeight: 800,
              fontSize: "1rem",
              boxShadow: "0 10px 25px rgba(245, 158, 11, 0.3)",
            }}
          >
            Checkout Order
          </Button>
        </Box>
      )}
    </Drawer>
  );
}
