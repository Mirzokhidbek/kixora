import { useState, useEffect } from "react";
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
  Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";

import ProductService from "../../services/ProductService";
import { setProducts } from "./slice";
import { retrieveProducts, retrieveRestaurant } from "./selector";
import { Product, ProductInquiry } from "../../../lib/types/product";
import { ProductCollection } from "../../../lib/enums/common.enum";
import { serverApi } from "../../../lib/config";

/** REDUX DISPATCH **/
const actionDispatch = (dispatch: Dispatch) => ({
  setProducts: (data: Product[]) => dispatch(setProducts(data)),
});

export function Products() {
  const navigate = useNavigate();
  const { setProducts } = actionDispatch(useDispatch());
  const products = useSelector(retrieveProducts);
  const restaurant = useSelector(retrieveRestaurant);

  const [productsSearch, setProductsSearch] = useState<ProductInquiry>({
    page: 1,
    limit: 8,
    order: "createdAt",
    productCollection: undefined,
    search: "",
  });

  const [favorites, setFavorites] = useState<string[]>([]);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  /** FETCH PRODUCTS ON INQUIRY CHANGE **/
  useEffect(() => {
    const productService = new ProductService();
    productService
      .getProducts(productsSearch)
      .then((data) => setProducts(data))
      .catch((err) => console.log("Products fetch error:", err));
  }, [productsSearch]);

  /** HANDLERS **/
  const searchHandler = (val: string) => {
    setProductsSearch({ ...productsSearch, page: 1, search: val });
  };

  const collectionHandler = (collection?: ProductCollection) => {
    setProductsSearch({
      ...productsSearch,
      page: 1,
      productCollection: collection,
    });
  };

  const orderHandler = (order: string) => {
    setProductsSearch({ ...productsSearch, page: 1, order: order });
  };

  const paginationHandler = (_: React.ChangeEvent<unknown>, value: number) => {
    setProductsSearch({ ...productsSearch, page: value });
  };

  const chosenProductHandler = (id: string) => {
    navigate(`/products/${id}`);
  };

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((item) => item !== id));
      setToastMsg("Removed from VIP Favorites");
    } else {
      setFavorites([...favorites, id]);
      setToastMsg("Added to VIP Favorites ❤️");
    }
    setToastOpen(true);
  };

  // Fallback items if database is clean
  const defaultProducts: Product[] = [
    {
      _id: "1",
      productName: "Burak Giant Tomahawk Steak",
      productPrice: 48.0,
      productLeftCount: 20,
      productCollection: ProductCollection.DISH,
      productStatus: "PROCESS" as any,
      productViews: 1240,
      productImages: [
        "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80",
      ],
      productDesc: "Dry-aged 45 days, seared over open oak embers with clarified Turkish butter.",
      createdAt: "",
      updatedAt: "",
    },
    {
      _id: "2",
      productName: "Sultan Meter Kebab",
      productPrice: 36.5,
      productLeftCount: 15,
      productCollection: ProductCollection.DISH,
      productStatus: "PROCESS" as any,
      productViews: 980,
      productImages: [
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
      ],
      productDesc: "Hand-minced lamb and beef with special Urfa isot peppers on skewers.",
      createdAt: "",
      updatedAt: "",
    },
    {
      _id: "3",
      productName: "Gaziantep Pistachio Baklava",
      productPrice: 14.5,
      productLeftCount: 30,
      productCollection: ProductCollection.DESSERT,
      productStatus: "PROCESS" as any,
      productViews: 860,
      productImages: [
        "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80",
      ],
      productDesc: "40 layers of paper-thin filo pastry filled with emerald Gaziantep pistachios.",
      createdAt: "",
      updatedAt: "",
    },
    {
      _id: "4",
      productName: "Golden Burak Wagyu Burger",
      productPrice: 19.9,
      productLeftCount: 25,
      productCollection: ProductCollection.DISH,
      productStatus: "PROCESS" as any,
      productViews: 740,
      productImages: [
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
      ],
      productDesc: "250g premium Wagyu beef patty, molten cheddar, smoked beef bacon on brioche.",
      createdAt: "",
      updatedAt: "",
    },
    {
      _id: "5",
      productName: "Traditional Ottoman Foamy Ayran",
      productPrice: 5.0,
      productLeftCount: 50,
      productCollection: ProductCollection.DRINK,
      productStatus: "PROCESS" as any,
      productViews: 520,
      productImages: [
        "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80",
      ],
      productDesc: "Served chilled in handcrafted authentic copper mugs with rich mountain mint.",
      createdAt: "",
      updatedAt: "",
    },
    {
      _id: "6",
      productName: "Aegean Cold Mezze Platter",
      productPrice: 22.0,
      productLeftCount: 18,
      productCollection: ProductCollection.SALAD,
      productStatus: "PROCESS" as any,
      productViews: 610,
      productImages: [
        "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80",
      ],
      productDesc: "Hummus with pastirma, smoky mutabal, spicy ezme, and freshly baked lavash.",
      createdAt: "",
      updatedAt: "",
    },
  ];

  const displayList = products.length ? products : defaultProducts;

  const getImageSrc = (img?: string) => {
    if (!img) return "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80";
    return img.startsWith("http") ? img : `${serverApi}/${img}`;
  };

  return (
    <Box sx={{ py: 6, minHeight: "85vh", bgcolor: "#f8fafc" }}>
      <Container maxWidth="lg">
        {/* Restaurant Header Badge */}
        {restaurant && (
          <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              label={`Official Restaurant: ${restaurant.memberNick}`}
              sx={{ bgcolor: "#0f172a", color: "#f59e0b", fontWeight: 800 }}
              size="small"
            />
          </Box>
        )}

        {/* Page Header */}
        <Box sx={{ mb: 5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
            <LocalFireDepartmentIcon sx={{ fontSize: 32, color: "primary.main" }} />
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              Burak Culinary Menu
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Authentic Ottoman recipes, fire-roasted prime meats, and handcrafted desserts prepared fresh daily.
          </Typography>
        </Box>

        {/* Search & Category Filter Controls */}
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
            value={productsSearch.productCollection || "ALL"}
            onChange={(_, val) => collectionHandler(val === "ALL" ? undefined : val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTabs-indicator": { backgroundColor: "#f59e0b", height: 3 },
              "& .MuiTab-root": {
                fontWeight: 700,
                fontSize: "0.95rem",
                color: "#64748b",
                "&.Mui-selected": { color: "#0f172a" },
              },
            }}
          >
            <Tab label="ALL DISHES" value="ALL" />
            <Tab label="MAIN DISHES" value={ProductCollection.DISH} />
            <Tab label="SALADS & MEZZE" value={ProductCollection.SALAD} />
            <Tab label="DESSERTS" value={ProductCollection.DESSERT} />
            <Tab label="DRINKS" value={ProductCollection.DRINK} />
          </Tabs>

          {/* Search Input */}
          <TextField
            size="small"
            placeholder="Search our menu..."
            value={productsSearch.search || ""}
            onChange={(e) => searchHandler(e.target.value)}
            sx={{
              minWidth: { xs: "100%", md: 280 },
              bgcolor: "#fff",
              borderRadius: 2,
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

        {/* Sort Filter Buttons */}
        <Box sx={{ display: "flex", gap: 1, mb: 4, flexWrap: "wrap" }}>
          <Chip
            label="Latest Added"
            clickable
            color={productsSearch.order === "createdAt" ? "primary" : "default"}
            onClick={() => orderHandler("createdAt")}
            sx={{ fontWeight: 700 }}
          />
          <Chip
            label="Most Popular (Views)"
            clickable
            color={productsSearch.order === "productViews" ? "primary" : "default"}
            onClick={() => orderHandler("productViews")}
            sx={{ fontWeight: 700 }}
          />
          <Chip
            label="Price: Low to High"
            clickable
            color={productsSearch.order === "productPrice" ? "primary" : "default"}
            onClick={() => orderHandler("productPrice")}
            sx={{ fontWeight: 700 }}
          />
        </Box>

        {/* Product Cards Grid */}
        <Grid container spacing={3.5}>
          {displayList.map((product) => (
            <Grid key={product._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card
                sx={{
                  borderRadius: 4,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  border: "1px solid #e2e8f0",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 20px 35px rgba(15, 23, 42, 0.12)",
                    borderColor: "primary.light",
                  },
                }}
                onClick={() => chosenProductHandler(product._id)}
              >
                <Box sx={{ position: "relative", overflow: "hidden" }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={getImageSrc(product.productImages?.[0])}
                    alt={product.productName}
                    sx={{
                      transition: "transform 0.5s ease",
                      "&:hover": { transform: "scale(1.06)" },
                    }}
                  />
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      bgcolor: "rgba(255, 255, 255, 0.9)",
                      "&:hover": { bgcolor: "#fff" },
                      color: favorites.includes(product._id) ? "#ef4444" : "#64748b",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product._id);
                    }}
                  >
                    {favorites.includes(product._id) ? (
                      <FavoriteIcon sx={{ fontSize: 20 }} />
                    ) : (
                      <FavoriteBorderIcon sx={{ fontSize: 20 }} />
                    )}
                  </IconButton>

                  <Chip
                    label={product.productCollection}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      bgcolor: "#0f172a",
                      color: "#f59e0b",
                      fontWeight: 800,
                      fontSize: "0.7rem",
                    }}
                  />

                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      bgcolor: "rgba(0,0,0,0.65)",
                      color: "#fff",
                      px: 1,
                      py: 0.2,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      fontSize: "0.72rem",
                    }}
                  >
                    <VisibilityIcon sx={{ fontSize: 13, color: "#f59e0b" }} />
                    <span>{product.productViews || 0}</span>
                  </Box>
                </Box>

                <CardContent
                  sx={{
                    flexGrow: 1,
                    p: 2.5,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 800,
                      fontSize: "1.05rem",
                      mb: 1,
                      lineHeight: 1.3,
                    }}
                  >
                    {product.productName}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      flexGrow: 1,
                      fontSize: "0.85rem",
                      lineHeight: 1.5,
                    }}
                  >
                    {product.productDesc || "Traditional Burak culinary creation."}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Rating value={5} readOnly size="small" sx={{ color: "#f59e0b" }} />
                    <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700 }}>
                      5.0
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: "auto",
                      pt: 1,
                      borderTop: "1px solid #f1f5f9",
                    }}
                  >
                    <div>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                        Price
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: "#0f172a" }}>
                        ${product.productPrice.toFixed(2)}
                      </Typography>
                    </div>

                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<AddShoppingCartIcon sx={{ fontSize: 16 }} />}
                      sx={{ borderRadius: 2.5, px: 2, fontWeight: 700, fontSize: "0.8rem" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setToastMsg(`Added "${product.productName}" to Cart!`);
                        setToastOpen(true);
                      }}
                    >
                      Add
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Pagination Controls */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <Pagination
            count={3}
            page={productsSearch.page}
            onChange={paginationHandler}
            color="primary"
            size="large"
            sx={{
              "& .MuiPaginationItem-root": { fontWeight: 700 },
              "& .Mui-selected": { bgcolor: "#f59e0b !important", color: "#000", fontWeight: 800 },
            }}
          />
        </Box>

        {/* VIP Toast Notification */}
        <Snackbar
          open={toastOpen}
          autoHideDuration={3000}
          onClose={() => setToastOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity="success" sx={{ width: "100%", borderRadius: 3, fontWeight: 700 }}>
            {toastMsg}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
