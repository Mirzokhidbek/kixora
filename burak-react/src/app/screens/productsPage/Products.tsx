import { useState, useEffect, useMemo } from "react";
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { Dispatch } from "@reduxjs/toolkit";

import ProductService from "../../services/ProductService";
import { setProducts } from "./slice";
import { retrieveProducts, retrieveRestaurant } from "./selector";
import type { Product, ProductInquiry } from "../../../lib/types/product";
import { ProductCollection } from "../../../lib/enums/common.enum";
import { serverApi } from "../../../lib/config";

interface ProductsProps {
  onAdd?: (item: any) => void;
}

/** REDUX DISPATCH **/
const actionDispatch = (dispatch: Dispatch) => ({
  setProducts: (data: Product[]) => dispatch(setProducts(data)),
});

export function Products({ onAdd }: ProductsProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setProducts } = useMemo(() => actionDispatch(dispatch), [dispatch]);
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
  }, [productsSearch, setProducts]);

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
      productName: "Traditional Foamy Ayran",
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
    <Box sx={{ py: 6, minHeight: "85vh", bgcolor: "#ffffff" }}>
      <Container maxWidth="lg">
        {/* Restaurant Header Badge */}
        {restaurant && (
          <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              label={`Official Restaurant: ${restaurant.memberNick}`}
              sx={{ bgcolor: "#fffbeb", color: "#d97706", fontWeight: 800, border: "1px solid #fef3c7" }}
              size="small"
            />
          </Box>
        )}

        {/* Page Header */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              color: "#0f172a",
              mb: 1,
              fontSize: { xs: "2.2rem", md: "2.8rem" },
            }}
          >
            Explore Our <span style={{ color: "#f59e0b" }}>Delicious</span> Menu
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
            Authentic Ottoman recipes, fire-roasted prime meats, and handcrafted delicacies prepared fresh daily.
          </Typography>
        </Box>

        {/* Search & Category Filter Controls */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", md: "center" },
            gap: 2.5,
            mb: 4.5,
            bgcolor: "#fbfbfe",
            p: 2,
            borderRadius: 4,
            border: "1px solid #f1f5f9",
          }}
        >
          {/* Category Tabs */}
          <Tabs
            value={productsSearch.productCollection || "ALL"}
            onChange={(_, val) => collectionHandler(val === "ALL" ? undefined : val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTabs-indicator": { backgroundColor: "#f59e0b", height: 3, borderRadius: 2 },
              "& .MuiTab-root": {
                fontWeight: 800,
                fontSize: "0.95rem",
                color: "#64748b",
                "&.Mui-selected": { color: "#f59e0b" },
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
            placeholder="Search our dishes..."
            value={productsSearch.search || ""}
            onChange={(e) => searchHandler(e.target.value)}
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
                    <SearchIcon sx={{ color: "#f59e0b" }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        {/* Sorting Chips */}
        <Box sx={{ display: "flex", gap: 1.5, mb: 4, flexWrap: "wrap", alignItems: "center" }}>
          <Typography variant="body2" sx={{ fontWeight: 800, color: "#64748b", mr: 1 }}>
            Sort By:
          </Typography>
          {[
            { label: "Latest Added", value: "createdAt" },
            { label: "Most Popular", value: "productViews" },
            { label: "Price: Low to High", value: "productPrice" },
          ].map((item) => (
            <Chip
              key={item.value}
              label={item.label}
              onClick={() => orderHandler(item.value)}
              sx={{
                fontWeight: 700,
                cursor: "pointer",
                bgcolor: productsSearch.order === item.value ? "#f59e0b" : "#ffffff",
                color: productsSearch.order === item.value ? "#ffffff" : "#475569",
                border: productsSearch.order === item.value ? "none" : "1px solid #e2e8f0",
                "&:hover": { bgcolor: productsSearch.order === item.value ? "#d97706" : "#f8fafc" },
              }}
            />
          ))}
        </Box>

        {/* Products Grid */}
        <Grid container spacing={3.5}>
          {displayList.map((product) => {
            const isFav = favorites.includes(product._id);
            return (
              <Grid key={product._id} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  sx={{
                    borderRadius: 5,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                    border: "1px solid #f1f5f9",
                    bgcolor: "#ffffff",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
                    cursor: "pointer",
                    overflow: "hidden",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 20px 40px rgba(245, 158, 11, 0.14)",
                      borderColor: "#fef3c7",
                    },
                  }}
                  onClick={() => chosenProductHandler(product._id)}
                >
                  {/* Image Presentation */}
                  <Box sx={{ position: "relative", overflow: "hidden", pt: "70%" }}>
                    <CardMedia
                      component="img"
                      image={getImageSrc(product.productImages?.[0])}
                      alt={product.productName}
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.5s ease",
                        "&:hover": { transform: "scale(1.08)" },
                      }}
                    />

                    {/* Favorite Heart Button */}
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product._id);
                      }}
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        bgcolor: "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(4px)",
                        color: isFav ? "#ef4444" : "#94a3b8",
                        "&:hover": { bgcolor: "#fff" },
                      }}
                    >
                      {isFav ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                    </IconButton>

                    {/* Category Chip */}
                    <Chip
                      label={product.productCollection || "DISH"}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        bgcolor: "#fffbeb",
                        color: "#d97706",
                        border: "1px solid #fef3c7",
                        fontWeight: 800,
                        fontSize: "0.7rem",
                      }}
                    />

                    {/* Views Count */}
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 12,
                        right: 12,
                        bgcolor: "rgba(15, 23, 42, 0.75)",
                        backdropFilter: "blur(6px)",
                        color: "#fff",
                        px: 1.2,
                        py: 0.4,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      <VisibilityIcon sx={{ fontSize: 14, color: "#f59e0b" }} />
                      <span>{product.productViews || 0}</span>
                    </Box>
                  </Box>

                  {/* Details */}
                  <CardContent sx={{ flexGrow: 1, p: 2.8, display: "flex", flexDirection: "column" }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, fontSize: "1.1rem", mb: 1, lineHeight: 1.3, color: "#0f172a" }}>
                      {product.productName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1, fontSize: "0.85rem", lineHeight: 1.6 }}>
                      {product.productDesc || "Traditional Ottoman delicacy crafted by Chef Burak."}
                    </Typography>

                    {/* Rating & In-stock */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                        <Rating value={5} readOnly size="small" sx={{ color: "#f59e0b" }} />
                        <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 800 }}>
                          5.0
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: "#10b981", fontWeight: 800, bgcolor: "#ecfdf5", px: 1, py: 0.3, borderRadius: 1.5 }}>
                        In Stock
                      </Typography>
                    </Box>

                    {/* Price & Action Button */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: "auto", pt: 1.5, borderTop: "1px solid #f8fafc" }}>
                      <Typography variant="h5" sx={{ fontWeight: 900, color: "#0f172a" }}>
                        ${product.productPrice?.toFixed(2)}
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<AddShoppingCartIcon sx={{ fontSize: 16 }} />}
                        sx={{
                          borderRadius: 3,
                          px: 2.5,
                          py: 0.8,
                          fontWeight: 800,
                          fontSize: "0.85rem",
                          bgcolor: "#eab308",
                          color: "#fff",
                          boxShadow: "0 4px 12px rgba(234, 179, 8, 0.3)",
                          "&:hover": { bgcolor: "#ca8a04" },
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onAdd) onAdd(product);
                          setToastMsg(`Added "${product.productName}" to cart!`);
                          setToastOpen(true);
                        }}
                      >
                        Add
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Pagination */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <Pagination
            count={3}
            page={productsSearch.page}
            onChange={paginationHandler}
            color="primary"
            size="large"
            sx={{
              "& .MuiPaginationItem-root": { fontWeight: 800, borderRadius: 2 },
            }}
          />
        </Box>

        {/* Global Toast */}
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
