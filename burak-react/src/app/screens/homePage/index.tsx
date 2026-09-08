import { useEffect, useMemo } from "react";
import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import type { Dispatch } from "@reduxjs/toolkit";

import { HeroBanner } from "./HeroBanner";
import { ValuePropsBar } from "./ValuePropsBar";
import { PopularDishes } from "./PopularDishes";
import { CategoryShowcase } from "./CategoryShowcase";
import { NewArrivalsBanner } from "./NewArrivalsBanner";
import { NewDishes } from "./NewDishes";

import ProductService from "../../services/ProductService";
import { setPopularDishes, setNewDishes } from "./slice";

interface HomePageProps {
  onAdd?: (item: any) => void;
}

/** REDUX SLICE DISPATCH SETUP **/
const actionDispatch = (dispatch: Dispatch) => ({
  setPopularDishes: (data: any) => dispatch(setPopularDishes(data)),
  setNewDishes: (data: any) => dispatch(setNewDishes(data)),
});

export function HomePage({ onAdd }: HomePageProps) {
  const dispatch = useDispatch();
  const { setPopularDishes, setNewDishes } = useMemo(
    () => actionDispatch(dispatch),
    [dispatch]
  );

  useEffect(() => {
    const productService = new ProductService();

    // 1. Fetch Popular Products (Highest Views)
    productService
      .getProducts({
        page: 1,
        limit: 8,
        order: "productViews",
      })
      .then((data) => setPopularDishes(data))
      .catch((err) => console.log("Popular shoes fetch error:", err));

    // 2. Fetch New Products (Latest Creation)
    productService
      .getProducts({
        page: 1,
        limit: 8,
        order: "createdAt",
      })
      .then((data) => setNewDishes(data))
      .catch((err) => console.log("New shoes fetch error:", err));
  }, [setPopularDishes, setNewDishes]);

  return (
    <Box sx={{ width: "100%", overflowX: "hidden", bgcolor: "#ffffff" }}>
      {/* 1. Hero Section (STEP INTO MORE, Black Container, CTA) */}
      <HeroBanner />

      {/* 2. Value Props Bar (Free Shipping, Returns, Secure, Support) */}
      <ValuePropsBar />

      {/* 3. Featured Shoes (Grid of dynamic shoe cards) */}
      <PopularDishes onAdd={onAdd} />

      {/* 4. Category Showcase (Sneakers, Running, Boots, Limited Drop) */}
      <CategoryShowcase />

      {/* 5. New Arrivals Banner (High impact CTA) */}
      <NewArrivalsBanner />

      {/* 6. New Arrivals Product Grid */}
      <NewDishes onAdd={onAdd} />
    </Box>
  );
}
