import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

const selectHomePage = (state: RootState) => state.homePage;

export const retrievePopularPicks = createSelector(
  selectHomePage,
  (homePage) => homePage.popularPicks
);

export const retrieveNewArrivals = createSelector(
  selectHomePage,
  (homePage) => homePage.newArrivals
);

export const retrieveTopUsers = createSelector(
  selectHomePage,
  (homePage) => homePage.topUsers
);
