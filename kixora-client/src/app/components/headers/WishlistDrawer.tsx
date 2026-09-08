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
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config";

interface WishlistDrawerProps {
  open: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemove: (productId: string) => void;
  onClear: () => void;
  onAddToCart: (product: any) => void;
}

export function WishlistDrawer({
  open,
  onClose,
  wishlist,
  onRemove,
  onClear,
  onAddToCart,
}: WishlistDrawerProps) {
  const navigate = useNavigate();

  const getImageSrc = (img?: string) => {
    if (!img) return "/sample.jpg";
    return img.startsWith("http") ? img : `${serverApi}/${img.replace("public/", "")}`;
  };

  const handleMoveAllToBag = () => {
    wishlist.forEach((item) => {
      onAddToCart({
        _id: item._id,
        quantity: 1,
        name: item.productName,
        price: item.productPrice,
        image: item.productImages?.[0] || "/sample.jpg",
      });
    });
    onClear();
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "100%", sm: 420 },
            bgcolor: "#ffffff",
            color: "#111827",
            display: "flex",
            flexDirection: "column",
            boxShadow: "-10px 0 40px rgba(0, 0, 0, 0.15)",
          },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2.5,
          px: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #f3f4f6",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <FavoriteIcon sx={{ color: "#e11d48", fontSize: 22 }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              fontSize: "1.1rem",
              fontFamily: '"Outfit", sans-serif',
              color: "#111827",
            }}
          >
            Saved Items
          </Typography>
          <Box
            sx={{
              bgcolor: "#f3f4f6",
              color: "#374151",
              fontSize: "0.75rem",
              fontWeight: 800,
              px: 1,
              py: 0.2,
              borderRadius: "12px",
            }}
          >
            {wishlist.length}
          </Box>
        </Box>

        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "#9ca3af",
            "&:hover": { color: "#000000", bgcolor: "#f3f4f6" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Wishlist Items List */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 3 }}>
        {wishlist.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              minHeight: 300,
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                bgcolor: "#fff1f2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <FavoriteIcon sx={{ fontSize: 32, color: "#e11d48" }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.8, fontSize: "1.1rem" }}>
              Your Wishlist is Empty
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280", mb: 3, maxWidth: 260, fontSize: "0.85rem" }}>
              Explore our footwear catalog and tap the heart icon to save your favorite luxury pairs.
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                onClose();
                navigate("/products");
              }}
              sx={{
                bgcolor: "#111827",
                color: "#ffffff",
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 700,
                px: 3,
                py: 1,
                "&:hover": { bgcolor: "#000000" },
              }}
            >
              Explore Collection
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {wishlist.map((item) => (
              <Box
                key={item._id}
                sx={{
                  display: "flex",
                  gap: 2,
                  p: 1.8,
                  borderRadius: "14px",
                  bgcolor: "#f9fafb",
                  border: "1px solid #f3f4f6",
                  transition: "all 0.2s ease",
                  "&:hover": { borderColor: "#e5e7eb", bgcolor: "#f3f4f6" },
                }}
              >
                <Avatar
                  src={getImageSrc(item.productImages?.[0])}
                  variant="rounded"
                  sx={{
                    width: 74,
                    height: 74,
                    borderRadius: "10px",
                    bgcolor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    objectFit: "cover",
                  }}
                />

                <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 800,
                          fontSize: "0.92rem",
                          lineHeight: 1.3,
                          color: "#111827",
                          cursor: "pointer",
                          "&:hover": { textDecoration: "underline" },
                        }}
                        onClick={() => {
                          onClose();
                          navigate(`/products/${item._id}`);
                        }}
                      >
                        {item.productName}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => onRemove(item._id)}
                        sx={{ color: "#9ca3af", p: 0.3, "&:hover": { color: "#e11d48" } }}
                      >
                        <DeleteOutlinedIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Box>

                    <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 600, display: "block", mt: 0.3 }}>
                      {item.productCollection || "Sneakers"} &bull; EU {item.productSizes?.[0] || 42}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900, color: "#111827", fontSize: "0.95rem" }}>
                      ${Number(item.productPrice).toFixed(2)}
                    </Typography>

                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<AddShoppingCartIcon sx={{ fontSize: 14 }} />}
                      onClick={() => {
                        onAddToCart({
                          _id: item._id,
                          quantity: 1,
                          name: item.productName,
                          price: item.productPrice,
                          image: item.productImages?.[0] || "/sample.jpg",
                        });
                        onRemove(item._id);
                      }}
                      sx={{
                        bgcolor: "#111827",
                        color: "#ffffff",
                        borderRadius: "8px",
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        py: 0.5,
                        px: 1.5,
                        boxShadow: "none",
                        "&:hover": { bgcolor: "#000000", boxShadow: "none" },
                      }}
                    >
                      Add to Bag
                    </Button>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Footer Actions */}
      {wishlist.length > 0 && (
        <Box
          sx={{
            p: 2.5,
            px: 3,
            borderTop: "1px solid #f3f4f6",
            bgcolor: "#ffffff",
            display: "flex",
            flexDirection: "column",
            gap: 1.2,
          }}
        >
          <Button
            fullWidth
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={handleMoveAllToBag}
            sx={{
              py: 1.2,
              borderRadius: "10px",
              bgcolor: "#111827",
              color: "#ffffff",
              fontWeight: 800,
              fontSize: "0.9rem",
              textTransform: "none",
              boxShadow: "none",
              "&:hover": { bgcolor: "#000000", boxShadow: "none" },
            }}
          >
            Move All to Bag ({wishlist.length})
          </Button>

          <Button
            fullWidth
            variant="text"
            onClick={onClear}
            sx={{
              color: "#6b7280",
              fontWeight: 600,
              fontSize: "0.8rem",
              textTransform: "none",
              "&:hover": { color: "#e11d48", bgcolor: "transparent" },
            }}
          >
            Clear Wishlist
          </Button>
        </Box>
      )}
    </Drawer>
  );
}
