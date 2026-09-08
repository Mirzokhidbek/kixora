import { useState, useEffect, useMemo } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  Pagination,
  Rating,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { Dispatch } from "@reduxjs/toolkit";

import { useWishlist } from "../../hooks/useWishlist";
import ProductService from "../../services/ProductService";
import { setProducts } from "./slice";
import { retrieveProducts } from "./selector";
import type { Product, ProductInquiry } from "../../../lib/types/product";
import { ProductCollection, ProductSize } from "../../../lib/enums/common.enum";
import { serverApi } from "../../../lib/config";

interface ProductsProps {
  onAdd?: (item: any, quantity?: number, size?: number, color?: string) => void;
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
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [productsSearch, setProductsSearch] = useState<ProductInquiry>({
    page: 1,
    limit: 9,
    order: "createdAt",
    productCollection: undefined,
    search: "",
    size: undefined,
  });

  const [searchText, setSearchText] = useState("");
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
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

  const sizeHandler = (size: number) => {
    const isAlreadySelected = selectedSize === size;
    const newSize = isAlreadySelected ? null : size;
    setSelectedSize(newSize);
    setProductsSearch({
      ...productsSearch,
      page: 1,
      size: newSize || undefined,
    });
  };

  const orderHandler = (order: string) => {
    setProductsSearch({ ...productsSearch, page: 1, order: order });
  };

  const paginationHandler = (_: React.ChangeEvent<unknown>, value: number) => {
    setProductsSearch({ ...productsSearch, page: value });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetFilters = () => {
    setSearchText("");
    setSelectedSize(null);
    setProductsSearch({
      page: 1,
      limit: 9,
      order: "createdAt",
      productCollection: undefined,
      search: "",
      size: undefined,
    });
    setToastMsg("Filters reset");
    setToastOpen(true);
  };

  const handleToggleWishlist = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const added = toggleWishlist(product);
    setToastMsg(added ? `Added "${product.productName}" to Wishlist!` : `Removed from Wishlist`);
    setToastOpen(true);
  };

  const getImageSrc = (img?: string) => {
    if (!img) return "/sample.jpg";
    return img.startsWith("http") ? img : `${serverApi}/${img.replace("public/", "")}`;
  };

  const categories = [
    { label: "All Footwear", value: undefined },
    { label: "Sneakers", value: ProductCollection.SNEAKERS },
    { label: "Running", value: ProductCollection.RUNNING },
    { label: "Boots", value: ProductCollection.BOOTS },
    { label: "Casual", value: ProductCollection.CASUAL },
    { label: "Limited Drops", value: ProductCollection.LIMITED_DROP },
  ];

  const sizeList = [38, 39, 40, 41, 42, 43, 44, 45];

  return (
    <Box sx={{ py: 6, bgcolor: "#ffffff", minHeight: "85vh" }}>
      <Container maxWidth="lg">
        {/* Page Header */}
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="caption"
            sx={{
              color: "#6b7280",
              fontWeight: 800,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontSize: "0.78rem",
            }}
          >
            KIXORA CATALOG
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              color: "#000000",
              fontSize: { xs: "2rem", md: "2.8rem" },
              letterSpacing: "-0.03em",
              mt: 0.5,
            }}
          >
            All Footwear
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Left Filter Sidebar */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Box
              sx={{
                p: 3,
                bgcolor: "#ffffff",
                borderRadius: 4,
                border: "1px solid #e5e7eb",
                position: { md: "sticky" },
                top: { md: 100 },
              }}
            >
              {/* Search Bar */}
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#111827", mb: 1.5 }}>
                Search
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Search models..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchProductHandler()}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                  },
                }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={searchProductHandler}>
                          <SearchIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {/* Category Filter */}
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#111827", mb: 1.5 }}>
                Categories
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8, mb: 3 }}>
                {categories.map((cat) => {
                  const isSelected = productsSearch.productCollection === cat.value;
                  return (
                    <Box
                      key={cat.label}
                      onClick={() => collectionHandler(cat.value)}
                      sx={{
                        py: 0.8,
                        px: 1.5,
                        borderRadius: 2,
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        bgcolor: isSelected ? "#000000" : "transparent",
                        color: isSelected ? "#ffffff" : "#4b5563",
                        fontWeight: isSelected ? 800 : 600,
                        fontSize: "0.88rem",
                        transition: "all 0.15s ease",
                        "&:hover": {
                          bgcolor: isSelected ? "#000000" : "#f3f4f6",
                        },
                      }}
                    >
                      <span>{cat.label}</span>
                      {isSelected && <span style={{ fontSize: "0.8rem" }}>&bull;</span>}
                    </Box>
                  );
                })}
              </Box>

              <Divider sx={{ my: 2.5 }} />

              {/* Size Filter */}
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#111827", mb: 1.5 }}>
                Shoe Size (EU)
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, mb: 3 }}>
                {sizeList.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <Button
                      key={size}
                      onClick={() => sizeHandler(size)}
                      sx={{
                        minWidth: 0,
                        py: 0.8,
                        borderRadius: 2,
                        border: isSelected ? "2px solid #000000" : "1px solid #e5e7eb",
                        bgcolor: isSelected ? "#000000" : "#ffffff",
                        color: isSelected ? "#ffffff" : "#111827",
                        fontWeight: 700,
                        fontSize: "0.82rem",
                        "&:hover": {
                          bgcolor: isSelected ? "#000000" : "#f3f4f6",
                        },
                      }}
                    >
                      {size}
                    </Button>
                  );
                })}
              </Box>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<RestartAltIcon />}
                onClick={resetFilters}
                sx={{
                  borderRadius: 9999,
                  borderColor: "#e5e7eb",
                  color: "#6b7280",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  textTransform: "none",
                  "&:hover": { borderColor: "#000000", color: "#000000", bgcolor: "transparent" },
                }}
              >
                Reset Filters
              </Button>
            </Box>
          </Grid>

          {/* Right Product Grid */}
          <Grid size={{ xs: 12, md: 9 }}>
            {/* Top Toolbar */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3.5,
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Typography variant="body2" sx={{ color: "#6b7280", fontWeight: 700 }}>
                Showing <strong style={{ color: "#111827" }}>{products.length}</strong> items
              </Typography>

              {/* Sort Order Selector */}
              <FormControl size="small" sx={{ minWidth: 190 }}>
                <InputLabel sx={{ fontSize: "0.85rem" }}>Sort by</InputLabel>
                <Select
                  value={productsSearch.order || "createdAt"}
                  label="Sort by"
                  onChange={(e) => orderHandler(e.target.value)}
                  sx={{
                    borderRadius: 2.5,
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  <MenuItem value="createdAt">Newest Drops</MenuItem>
                  <MenuItem value="productViews">Most Popular</MenuItem>
                  <MenuItem value="productPrice">Price: Low to High</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Empty State */}
            {products.length === 0 && (
              <Box
                sx={{
                  py: 10,
                  textAlign: "center",
                  bgcolor: "#f9fafb",
                  borderRadius: 4,
                  border: "1px dashed #e5e7eb",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#111827", mb: 1 }}>
                  No footwear found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Try adjusting your size or search query, or reset the filters.
                </Typography>
                <Button
                  variant="contained"
                  onClick={resetFilters}
                  sx={{
                    bgcolor: "#000000",
                    color: "#ffffff",
                    borderRadius: 9999,
                    fontWeight: 700,
                    textTransform: "none",
                  }}
                >
                  Reset All Filters
                </Button>
              </Box>
            )}

            {/* Products Grid */}
            <Grid container spacing={3}>
              {products.map((product) => {
                const isFav = isInWishlist(product._id);
                const image = product.productImages?.[0] ? getImageSrc(product.productImages[0]) : "";

                return (
                  <Grid key={product._id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card
                      onClick={() => navigate(`/products/${product._id}`)}
                      sx={{
                        bgcolor: "#ffffff",
                        borderRadius: 4,
                        border: "1px solid #e5e7eb",
                        boxShadow: "none",
                        cursor: "pointer",
                        transition: "all 0.25s ease",
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        position: "relative",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 12px 30px rgba(0, 0, 0, 0.08)",
                          borderColor: "#d1d5db",
                        },
                      }}
                    >
                      {/* Wishlist Button */}
                      <IconButton
                        size="small"
                        onClick={(e) => handleToggleWishlist(e, product)}
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          zIndex: 2,
                          bgcolor: "rgba(255, 255, 255, 0.9)",
                          backdropFilter: "blur(4px)",
                          border: "1px solid #e5e7eb",
                          p: 0.8,
                          "&:hover": { bgcolor: "#ffffff" },
                        }}
                      >
                        {isFav ? (
                          <FavoriteIcon sx={{ color: "#e11d48", fontSize: 18 }} />
                        ) : (
                          <FavoriteBorderIcon sx={{ color: "#6b7280", fontSize: 18 }} />
                        )}
                      </IconButton>

                      {/* Image Preview */}
                      <Box
                        sx={{
                          p: 3,
                          bgcolor: "#f9fafb",
                          borderTopLeftRadius: 16,
                          borderTopRightRadius: 16,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: 220,
                          overflow: "hidden",
                        }}
                      >
                        {image ? (
                          <CardMedia
                            component="img"
                            image={image}
                            alt={product.productName}
                            onError={(e: any) => {
                              e.target.src = "/img/kixora/sneakers.jpg";
                            }}
                            sx={{
                              maxHeight: 180,
                              objectFit: "contain",
                              transition: "transform 0.3s ease",
                              "&:hover": { transform: "scale(1.06) rotate(-4deg)" },
                            }}
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            KIXORA
                          </Typography>
                        )}
                      </Box>

                      {/* Content */}
                      <CardContent sx={{ p: 2.5, flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#6b7280",
                              fontWeight: 700,
                              fontSize: "0.72rem",
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                            }}
                          >
                            {product.productCollection || "SNEAKERS"}
                          </Typography>

                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 800,
                              color: "#111827",
                              lineHeight: 1.3,
                              mt: 0.3,
                              mb: 1,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {product.productName}
                          </Typography>

                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 1.5 }}>
                            <Rating value={4.8} precision={0.1} size="small" readOnly sx={{ fontSize: "0.95rem" }} />
                            <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 700 }}>
                              4.8 (1.2k)
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pt: 1, borderTop: "1px solid #f3f4f6" }}>
                          <Typography variant="h6" sx={{ fontWeight: 900, color: "#000000", fontSize: "1.15rem" }}>
                            ${product.productPrice.toFixed(2)}
                          </Typography>

                          <Button
                            size="small"
                            variant="contained"
                            onClick={(e) => {
                              e.stopPropagation();
                              onAdd && onAdd(product, 1, selectedSize || product.productSizes?.[0] || 42, "Standard");
                            }}
                            startIcon={<AddShoppingCartIcon sx={{ fontSize: 16 }} />}
                            sx={{
                              bgcolor: "#000000",
                              color: "#ffffff",
                              borderRadius: 9999,
                              px: 2,
                              py: 0.7,
                              fontSize: "0.78rem",
                              fontWeight: 700,
                              textTransform: "none",
                              boxShadow: "none",
                              "&:hover": { bgcolor: "#262626", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" },
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
                sx={{
                  "& .MuiPaginationItem-root": {
                    fontWeight: 700,
                    borderRadius: 2,
                    "&.Mui-selected": {
                      bgcolor: "#000000",
                      color: "#ffffff",
                      "&:hover": { bgcolor: "#262626" },
                    },
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
