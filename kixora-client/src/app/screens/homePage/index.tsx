import { useEffect, useMemo } from "react";
import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import type { Dispatch } from "@reduxjs/toolkit";

import { HeroBanner } from "./HeroBanner";
import { PopularPicks } from "./PopularPicks";
import { ValuePropsBar } from "./ValuePropsBar";
import { CategoryShowcase } from "./CategoryShowcase";
import { NewArrivals } from "./NewArrivals";
import { BrandVideo } from "./BrandVideo";
import { NewArrivalsBanner } from "./NewArrivalsBanner";

import ProductService from "../../services/ProductService";
import { setPopularPicks, setNewArrivals } from "./slice";

interface HomePageProps {
  onAdd?: (item: any) => void;
}

/** REDUX SLICE DISPATCH SETUP **/
const actionDispatch = (dispatch: Dispatch) => ({
  setPopularPicks: (data: any) => dispatch(setPopularPicks(data)),
  setNewArrivals: (data: any) => dispatch(setNewArrivals(data)),
});

export function HomePage({ onAdd }: HomePageProps) {
  const dispatch = useDispatch();
  const { setPopularPicks, setNewArrivals } = useMemo(
    () => actionDispatch(dispatch),
    [dispatch]
  );

  useEffect(() => {
    const productService = new ProductService();

    productService
      .getProducts({
        page: 1,
        limit: 8,
        order: "productViews",
      })
      .then((data) => setPopularPicks(data))
      .catch((err) => console.log("Popular shoes fetch error:", err));

    productService
      .getProducts({
        page: 1,
        limit: 8,
        order: "createdAt",
      })
      .then((data) => setNewArrivals(data))
      .catch((err) => console.log("New shoes fetch error:", err));
  }, [setPopularPicks, setNewArrivals]);

  return (
    <Box sx={{ width: "100%", overflowX: "hidden", bgcolor: "#ffffff" }}>
      {/* 1. Hero Section (STEP INTO MORE, Light Container, Triple Badges, Solid Black CTA, AI Search Bar) */}
      <HeroBanner onAdd={onAdd} />


      {/* 2. Popular Picks (Best Sellers 4-Card Grid with Solid Black "Add to Cart" Buttons) */}
      <PopularPicks onAdd={onAdd} />

      {/* 3. Fresh Arrivals / Latest Drops Grid */}
      <NewArrivals onAdd={onAdd} />

      {/* 4. Value Props Bar (Free Shipping, Secure Payments, Easy Returns, 24/7 Support) */}
      <ValuePropsBar />

      {/* 5. Category Showcase (Sneakers, Running, Boots, Limited Drop) */}
      <CategoryShowcase />

      {/* 5. Cinematic Brand Lab Video Showcase */}
      <BrandVideo />

      {/* 6. New Arrivals Banner */}
      <NewArrivalsBanner />
    </Box>
  );
}
