import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";

import { Products } from "./Products";
import { ChosenProduct } from "./ChosenProduct";
import MemberService from "../../services/MemberService";
import { setRestaurant } from "./slice";

/** REDUX DISPATCH SETUP **/
const actionDispatch = (dispatch: Dispatch) => ({
  setRestaurant: (data: any) => dispatch(setRestaurant(data)),
});

export function ProductsPage() {
  const { setRestaurant } = actionDispatch(useDispatch());

  useEffect(() => {
    const memberService = new MemberService();
    memberService
      .getRestaurant()
      .then((data) => setRestaurant(data))
      .catch((err) => console.log("Get restaurant error:", err));
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Products />} />
      <Route path="/:productId" element={<ChosenProduct />} />
    </Routes>
  );
}
