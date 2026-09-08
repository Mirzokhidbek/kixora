import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

const selectProductsPage = (state: RootState) => state.productsPage;

export const retrieveRestaurant = createSelector(
  selectProductsPage,
  (productsPage) => productsPage.restaurant
);

export const retrieveChosenProduct = createSelector(
  selectProductsPage,
  (productsPage) => productsPage.chosenProduct
);

export const retrieveProducts = createSelector(
  selectProductsPage,
  (productsPage) => productsPage.products
);
