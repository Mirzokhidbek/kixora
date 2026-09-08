import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

const selectOrdersPage = (state: RootState) => state.ordersPage;

export const retrievePausedOrders = createSelector(
  selectOrdersPage,
  (ordersPage) => ordersPage.pausedOrders
);

export const retrieveProcessOrders = createSelector(
  selectOrdersPage,
  (ordersPage) => ordersPage.processOrders
);

export const retrieveFinishedOrders = createSelector(
  selectOrdersPage,
  (ordersPage) => ordersPage.finishedOrders
);
