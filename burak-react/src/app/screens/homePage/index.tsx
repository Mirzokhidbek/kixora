import { useEffect, useMemo } from "react";
import { Box } from "@mui/material";
import { useDispatch } from "react-redux";
import type { Dispatch } from "@reduxjs/toolkit";

import { HeroBanner } from "./HeroBanner";
import { Statistics } from "./Statistics";
import { PopularDishes } from "./PopularDishes";
import { NewDishes } from "./NewDishes";
import { Advertisement } from "./Advertisement";
import { ActiveUsers } from "./ActiveUsers";
import { Events } from "./Events";

import ProductService from "../../services/ProductService";
import MemberService from "../../services/MemberService";
import { setPopularDishes, setNewDishes, setTopUsers } from "./slice";
import { ProductCollection } from "../../../lib/enums/common.enum";

interface HomePageProps {
  onAdd?: (item: any) => void;
}

/** REDUX SLICE DISPATCH SETUP **/
const actionDispatch = (dispatch: Dispatch) => ({
  setPopularDishes: (data: any) => dispatch(setPopularDishes(data)),
  setNewDishes: (data: any) => dispatch(setNewDishes(data)),
  setTopUsers: (data: any) => dispatch(setTopUsers(data)),
});

export function HomePage({ onAdd }: HomePageProps) {
  const dispatch = useDispatch();
  const { setPopularDishes, setNewDishes, setTopUsers } = useMemo(
    () => actionDispatch(dispatch),
    [dispatch]
  );

  useEffect(() => {
    const productService = new ProductService();
    const memberService = new MemberService();

    // 1. Fetch Popular Dishes (Highest Views)
    productService
      .getProducts({
        page: 1,
        limit: 4,
        order: "productViews",
        productCollection: ProductCollection.DISH,
      })
      .then((data) => setPopularDishes(data))
      .catch((err) => console.log("Popular dishes fetch error:", err));

    // 2. Fetch New Dishes (Latest Creation)
    productService
      .getProducts({
        page: 1,
        limit: 4,
        order: "createdAt",
      })
      .then((data) => setNewDishes(data))
      .catch((err) => console.log("New dishes fetch error:", err));

    // 3. Fetch Top Users (Highest Points)
    memberService
      .getTopUsers()
      .then((data) => setTopUsers(data))
      .catch((err) => console.log("Top users fetch error:", err));
  }, [setPopularDishes, setNewDishes, setTopUsers]);

  return (
    <Box sx={{ width: "100%", overflowX: "hidden", bgcolor: "#ffffff" }}>
      {/* 1. Primary Hero Section (Orbiting Dishes, Clean Typography, Dual CTA) */}
      <HeroBanner />

      {/* 2. Most Popular Signature Dishes */}
      <PopularDishes onAdd={onAdd} />

      {/* 3. New Culinary Arrivals */}
      <NewDishes onAdd={onAdd} />

      {/* 4. Brand Statistics & Excellence Metrics */}
      <Statistics />

      {/* 5. Live CZN Burak Show Banner */}
      <Advertisement />

      {/* 6. Active VIP Foodies & Top Community Reviews */}
      <ActiveUsers />

      {/* 7. Upcoming Gastro Events & Masterclasses */}
      <Events />
    </Box>
  );
}
