import { configureStore } from "@reduxjs/toolkit";
import homePageReducer from "./screens/homePage/slice";
import productsPageReducer from "./screens/productsPage/slice";
import ordersPageReducer from "./screens/ordersPage/slice";

export const store = configureStore({
  reducer: {
    homePage: homePageReducer,
    productsPage: productsPageReducer,
    ordersPage: ordersPageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
