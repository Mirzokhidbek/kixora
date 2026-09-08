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
  IconButton,
  Snackbar,
  Alert,
  Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
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

  const [searchText, setSearchText] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    const productService = new ProductService();
    productService
      .getProducts(productsSearch)
      .then((data) => setProducts(data))
      .catch((err) => console.log("Products fetch error:", err));
  }, [productsSearch, setProducts]);

  const searchProductHandler = () => {
    setProductsSearch({
      ...productsSearch,
      page: 1,
      search: searchText,
    });
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

  const getImageSrc = (img?: string) => {
    if (!img) return "";
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
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} sx={{ alignItems: "center" }}>
            {/* Search Input */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search dishes, steaks, kebabs, desserts..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchProductHandler()}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "#f59e0b" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={searchProductHandler}
                        sx={{
                          borderRadius: 2,
                          bgcolor: "#f59e0b",
                          fontWeight: 700,
                          "&:hover": { bgcolor: "#d97706" },
                        }}
                      >
                        Search
                      </Button>
                    ),
                  },
                }}
                sx={{
                  bgcolor: "#fbfbfe",
                  borderRadius: 3,
                  "& .MuiOutlinedInput-root": { borderRadius: 3 },
                }}
              />
            </Grid>

            {/* Sorting Order Buttons */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: "flex", gap: 1, justifyContent: { xs: "flex-start", md: "flex-end" }, flexWrap: "wrap" }}>
                <Button
                  variant={productsSearch.order === "createdAt" ? "contained" : "outlined"}
                  size="small"
                  onClick={() => orderHandler("createdAt")}
                  sx={{
                    borderRadius: 2.5,
                    fontWeight: 700,
                    bgcolor: productsSearch.order === "createdAt" ? "#0f172a" : "transparent",
                    color: productsSearch.order === "createdAt" ? "#fff" : "#64748b",
                    borderColor: "#e2e8f0",
                  }}
                >
                  Newest
                </Button>
                <Button
                  variant={productsSearch.order === "productPrice" ? "contained" : "outlined"}
                  size="small"
                  onClick={() => orderHandler("productPrice")}
                  sx={{
                    borderRadius: 2.5,
                    fontWeight: 700,
                    bgcolor: productsSearch.order === "productPrice" ? "#0f172a" : "transparent",
                    color: productsSearch.order === "productPrice" ? "#fff" : "#64748b",
                    borderColor: "#e2e8f0",
                  }}
                >
                  Price
                </Button>
                <Button
                  variant={productsSearch.order === "productViews" ? "contained" : "outlined"}
                  size="small"
                  onClick={() => orderHandler("productViews")}
                  sx={{
                    borderRadius: 2.5,
                    fontWeight: 700,
                    bgcolor: productsSearch.order === "productViews" ? "#0f172a" : "transparent",
                    color: productsSearch.order === "productViews" ? "#fff" : "#64748b",
                    borderColor: "#e2e8f0",
                  }}
                >
                  Popular Views
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Category Tabs */}
        <Box sx={{ borderBottom: "1px solid #f1f5f9", mb: 4 }}>
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
            <Tab label="BEVERAGES" value={ProductCollection.DRINK} />
            <Tab label="OTHER" value={ProductCollection.OTHER} />
          </Tabs>
        </Box>

        {/* Products Grid */}
        {products.length === 0 ? (
          <Box sx={{ py: 8, textAlign: "center" }}>
            <Box sx={{ p: 5, borderRadius: 4, bgcolor: "#fbfbfe", border: "1px dashed #e2e8f0", maxWidth: 500, mx: "auto" }}>
              <RestaurantMenuIcon sx={{ fontSize: 44, color: "#94a3b8", mb: 1.5 }} />
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a", mb: 1 }}>
                No Dishes in Menu
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dishes created by the admin in the BSSR Admin Panel will appear here live.
              </Typography>
            </Box>
          </Box>
        ) : (
          <Grid container spacing={3.5}>
            {products.map((product) => (
              <Grid key={product._id} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  sx={{
                    borderRadius: 5,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                    border: "1px solid #f1f5f9",
                    bgcolor: "#ffffff",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
                    cursor: "pointer",
                    overflow: "hidden",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 20px 40px rgba(245, 158, 11, 0.12)",
                      borderColor: "#fde68a",
                    },
                  }}
                  onClick={() => chosenProductHandler(product._id)}
                >
                  {/* Card Media Header */}
                  <Box sx={{ position: "relative", overflow: "hidden", pt: "68%" }}>
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

                    {/* Views Overlay */}
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
                      👁 {product.productViews || 0}
                    </Box>

                    {/* Category Chip */}
                    <Chip
                      label={product.productCollection || "DISH"}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 14,
                        left: 14,
                        bgcolor: "#ffffff",
                        color: "#d97706",
                        fontWeight: 800,
                        fontSize: "0.68rem",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                      }}
                    />

                    {/* Favorite Button */}
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
                        bgcolor: "rgba(255,255,255,0.9)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        "&:hover": { bgcolor: "#fff" },
                      }}
                    >
                      {favorites.includes(product._id) ? (
                        <FavoriteIcon sx={{ color: "#ef4444", fontSize: 18 }} />
                      ) : (
                        <FavoriteBorderIcon sx={{ color: "#64748b", fontSize: 18 }} />
                      )}
                    </IconButton>
                  </Box>

                  {/* Card Content */}
                  <CardContent sx={{ flexGrow: 1, p: 2.8, display: "flex", flexDirection: "column" }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, fontSize: "1.05rem", mb: 1, lineHeight: 1.3, color: "#0f172a" }}>
                      {product.productName}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1, fontSize: "0.85rem", lineHeight: 1.6 }}>
                      {product.productDesc || "Authentic specialty prepared fresh on wood fire."}
                    </Typography>

                    {/* Price and Add to Basket Button */}
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
                          py: 0.7,
                          fontWeight: 800,
                          fontSize: "0.82rem",
                          bgcolor: "#f59e0b",
                          color: "#090d16",
                          boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
                          "&:hover": { bgcolor: "#d97706", color: "#fff" },
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onAdd) onAdd(product);
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
        )}

        {/* Pagination */}
        {products.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <Pagination
              count={3}
              page={productsSearch.page}
              onChange={paginationHandler}
              color="primary"
              sx={{
                "& .MuiPaginationItem-root": {
                  fontWeight: 700,
                  borderRadius: 2,
                },
              }}
            />
          </Box>
        )}

        {/* Toast Notification */}
        <Snackbar
          open={toastOpen}
          autoHideDuration={2500}
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
