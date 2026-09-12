import { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Rating,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import StarIcon from "@mui/icons-material/Star";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";

export interface ProductItem {
  id: number;
  name: string;
  price: number;
  collection: "DISH" | "DRINK" | "DESERT" | "OTHER";
  size: string;
  desc: string;
  rating: number;
  reviews: number;
  isPopular?: boolean;
  image: string;
}

export const PRODUCTS_LIST: ProductItem[] = [
  {
    id: 1,
    name: "Burak Giant Tomahawk Steak",
    price: 48.0,
    collection: "DISH",
    size: "LARGE",
    desc: "Prime dry-aged 1.2kg bone-in ribeye, flamed tableside with clarified herb butter.",
    rating: 4.9,
    reviews: 320,
    isPopular: true,
    image: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Sultan Meter Kebab",
    price: 36.5,
    collection: "DISH",
    size: "SET",
    desc: "1-meter minced lamb and beef kebab grilled over oak charcoal with lavash and sumac onions.",
    rating: 4.8,
    reviews: 215,
    isPopular: true,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Golden Cheddar Burger",
    price: 19.9,
    collection: "DISH",
    size: "NORMAL",
    desc: "Double wagyu smash patties drenched in melted English cheddar and caramel glaze.",
    rating: 4.7,
    reviews: 180,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "Gaziantep Pistachio Baklava",
    price: 14.5,
    collection: "DESERT",
    size: "SET",
    desc: "40 delicate layers of buttered phyllo pastry loaded with vibrant emerald green pistachios.",
    rating: 5.0,
    reviews: 410,
    isPopular: true,
    image: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    name: "Kunefe with Maraş Ice Cream",
    price: 13.0,
    collection: "DESERT",
    size: "NORMAL",
    desc: "Crispy shredded kadayif pastry with molten stretchy cheese, soaked in orange blossom syrup.",
    rating: 4.9,
    reviews: 195,
    image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    name: "Traditional Ottoman Ayran",
    price: 5.0,
    collection: "DRINK",
    size: "1L",
    desc: "Hand-whipped chilled salted yogurt drink served in copper cups with creamy frothy foam.",
    rating: 4.8,
    reviews: 140,
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 7,
    name: "Turkish Black Sea Tea Pot",
    price: 6.5,
    collection: "DRINK",
    size: "1.5L",
    desc: "Double-brewed organic Rize black tea infused with bergamot and Turkish delight sweets.",
    rating: 4.9,
    reviews: 260,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 8,
    name: "Chef's Mezze Platter",
    price: 22.0,
    collection: "OTHER",
    size: "SET",
    desc: "Hummus, Haydari, Babaganoush, Atom spicy labneh, and warm tandoor flatbread.",
    rating: 4.8,
    reviews: 110,
    image: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80",
  },
];

export function Products() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((f) => f !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const handleAddToCart = (productName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setToastMessage(`Added "${productName}" to your order!`);
    setToastOpen(true);
  };

  const filteredProducts = PRODUCTS_LIST.filter((p) => {
    const matchesTab = selectedTab === "ALL" || p.collection === selectedTab;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <Box sx={{ py: 6, minHeight: "85vh" }}>
      <Container maxWidth="lg">
        {/* Header Hero Banner */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            color: "#fff",
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            mb: 5,
            position: "relative",
            overflow: "hidden",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <Box sx={{ maxWidth: 650, position: "relative", zIndex: 1 }}>
            <Chip
              icon={<LocalFireDepartmentIcon sx={{ color: "#f59e0b !important" }} />}
              label="BURAK SIGNATURE MENU"
              sx={{
                bgcolor: "rgba(245, 158, 11, 0.15)",
                color: "#f59e0b",
                fontWeight: 700,
                mb: 2,
                border: "1px solid rgba(245, 158, 11, 0.3)",
              }}
            />
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1.5, fontSize: { xs: "1.8rem", md: "2.5rem" } }}>
              Taste The World-Famous Delicacies
            </Typography>
            <Typography variant="body1" sx={{ color: "#94a3b8" }}>
              Explore our chef-curated selection of wood-fired steaks, signature kebabs, authentic appetizers, and freshly baked desserts.
            </Typography>
          </Box>
        </Box>

        {/* Filters and Search Bar */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", md: "center" },
            gap: 2,
            mb: 4,
          }}
        >
          {/* Category Tabs */}
          <Tabs
            value={selectedTab}
            onChange={(_, val) => setSelectedTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTabs-indicator": { backgroundColor: "#f59e0b", height: 3, borderRadius: 2 },
              "& .MuiTab-root": {
                fontWeight: 700,
                fontSize: "0.95rem",
                color: "#64748b",
                "&.Mui-selected": { color: "#0f172a" },
              },
            }}
          >
            <Tab label="ALL OFFERINGS" value="ALL" />
            <Tab label="STEAKS & DISHES" value="DISH" />
            <Tab label="DESSERTS" value="DESERT" />
            <Tab label="BEVERAGES" value="DRINK" />
            <Tab label="APPETIZERS" value="OTHER" />
          </Tabs>

          {/* Search Bar */}
          <TextField
            size="small"
            placeholder="Search dishes, ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              minWidth: { xs: "100%", md: 280 },
              bgcolor: "#fff",
              borderRadius: 3,
              "& .MuiOutlinedInput-root": { borderRadius: 3 },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "primary.main" }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        {/* Product Cards Grid */}
        <Grid container spacing={3.5}>
          {filteredProducts.map((p) => (
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={p.id}>
              <Card
                onClick={() => navigate(`/products/${p.id}`)}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 4,
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  border: "1px solid #e2e8f0",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 16px 32px rgba(15, 23, 42, 0.12)",
                    borderColor: "#f59e0b",
                  },
                }}
              >
                {/* Image Container with Badges */}
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="210"
                    image={p.image}
                    alt={p.name}
                    sx={{ objectFit: "cover" }}
                  />
                  {p.isPopular && (
                    <Chip
                      icon={<LocalFireDepartmentIcon sx={{ fontSize: 16, color: "#fff !important" }} />}
                      label="CHEF CHOICE"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        bgcolor: "#ef4444",
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: "0.72rem",
                        boxShadow: "0 2px 8px rgba(239, 68, 68, 0.4)",
                      }}
                    />
                  )}
                  <IconButton
                    onClick={(e) => toggleFavorite(p.id, e)}
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      bgcolor: "rgba(255, 255, 255, 0.85)",
                      backdropFilter: "blur(4px)",
                      "&:hover": { bgcolor: "#fff", transform: "scale(1.1)" },
                    }}
                  >
                    {favorites.includes(p.id) ? (
                      <FavoriteIcon sx={{ color: "#ef4444", fontSize: 20 }} />
                    ) : (
                      <FavoriteBorderIcon sx={{ color: "#64748b", fontSize: 20 }} />
                    )}
                  </IconButton>
                </Box>

                {/* Card Content */}
                <CardContent sx={{ p: 2.5, flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Chip
                        label={p.collection}
                        size="small"
                        sx={{
                          bgcolor: "rgba(245, 158, 11, 0.1)",
                          color: "#d97706",
                          fontWeight: 700,
                          fontSize: "0.72rem",
                          borderRadius: 1.5,
                        }}
                      />
                      <Typography variant="caption" sx={{ fontWeight: 600, color: "#64748b" }}>
                        Portion: {p.size}
                      </Typography>
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.8, fontSize: "1.05rem", lineHeight: 1.3 }}>
                      {p.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        fontSize: "0.85rem",
                        lineHeight: 1.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {p.desc}
                    </Typography>
                  </div>

                  <div>
                    {/* Ratings */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1.5 }}>
                      <Rating
                        value={p.rating}
                        precision={0.1}
                        readOnly
                        size="small"
                        emptyIcon={<StarIcon style={{ opacity: 0.4 }} fontSize="inherit" />}
                      />
                      <Typography variant="caption" sx={{ fontWeight: 700, color: "#0f172a" }}>
                        {p.rating}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ({p.reviews})
                      </Typography>
                    </Box>

                    {/* Price and Action Buttons */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pt: 1, borderTop: "1px solid #f1f5f9" }}>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a" }}>
                        ${p.price.toFixed(2)}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => navigate(`/products/${p.id}`)}
                          sx={{ borderRadius: 2, minWidth: 36, px: 1 }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={(e) => handleAddToCart(p.name, e)}
                          startIcon={<AddShoppingCartIcon />}
                          sx={{
                            borderRadius: 2,
                            px: 1.8,
                            fontWeight: 700,
                            boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
                          }}
                        >
                          Add
                        </Button>
                      </Box>
                    </Box>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Toast Notification */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setToastOpen(false)} severity="success" sx={{ width: "100%", borderRadius: 2 }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
