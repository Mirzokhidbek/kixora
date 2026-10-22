import { Box, Card, CardContent, CardMedia, IconButton, Stack, Typography } from "@mui/material";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import type { Product } from "../../../lib/types/product";
import { getImageUrl } from "../../../lib/config";

interface AIProductCardProps {
  product: Product;
  onView: (productId: string) => void;
  onAddToCart?: (product: Product) => void;
}

/** One matched product in the AI search results */
export function AIProductCard({ product, onView, onAddToCart }: AIProductCardProps) {
  const imgUrl = getImageUrl(product.productImages?.[0] || "/img/kixora/hero_shoe1.png");
  return (
    <Card
      sx={{
        borderRadius: "16px",
        border: "1px solid #f1f5f9",
        boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
        transition: "all 0.25s ease",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
          borderColor: "#e2e8f0",
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          bgcolor: "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 160,
          cursor: "pointer",
        }}
        onClick={() => onView(product._id)}
      >
        <CardMedia
          component="img"
          image={imgUrl}
          alt={product.productName}
          onError={(e: any) => {
            e.target.src = "/img/kixora/hero_shoe1.png";
          }}
          sx={{
            maxHeight: "100%",
            width: "auto",
            objectFit: "contain",
            filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.12))",
          }}
        />
      </Box>

      <CardContent sx={{ p: 2, flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Typography
          variant="caption"
          sx={{
            color: "#64748b",
            fontWeight: 800,
            fontSize: "0.7rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {product.productCollection}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 800,
            color: "#0f172a",
            fontSize: "0.92rem",
            mb: 1,
            lineHeight: 1.3,
            cursor: "pointer",
          }}
          onClick={() => onView(product._id)}
        >
          {product.productName}
        </Typography>

        <Box sx={{ mt: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="body1" sx={{ fontWeight: 900, color: "#0f172a", fontSize: "1rem" }}>
            ${product.productPrice}
          </Typography>

          <Stack direction="row" spacing={0.8}>
            <IconButton
              size="small"
              onClick={() => onView(product._id)}
              sx={{
                bgcolor: "#f1f5f9",
                color: "#0f172a",
                "&:hover": { bgcolor: "#e2e8f0" },
              }}
            >
              <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
            </IconButton>
            {onAddToCart && (
              <IconButton
                size="small"
                onClick={() => onAddToCart(product)}
                sx={{
                  bgcolor: "#0f172a",
                  color: "#ffffff",
                  "&:hover": { bgcolor: "#000000" },
                }}
              >
                <LocalMallOutlinedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            )}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
