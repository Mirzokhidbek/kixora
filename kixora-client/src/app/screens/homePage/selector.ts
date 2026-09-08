import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

const selectHomePage = (state: RootState) => state.homePage;

export const retrievePopularDishes = createSelector(
  selectHomePage,
  (homePage) => homePage.popularDishes
);

export const retrieveNewDishes = createSelector(
  selectHomePage,
  (homePage) => homePage.newDishes
);

export const retrieveTopUsers = createSelector(
  selectHomePage,
  (homePage) => homePage.topUsers
);
