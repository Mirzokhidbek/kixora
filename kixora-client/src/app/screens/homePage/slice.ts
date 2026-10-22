import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../../lib/types/product";
import type { Member } from "../../../lib/types/member";

interface HomePageState {
  popularPicks: Product[];
  newArrivals: Product[];
  topUsers: Member[];
}

const initialState: HomePageState = {
  popularPicks: [],
  newArrivals: [],
  topUsers: [],
};

export const homePageSlice = createSlice({
  name: "homePage",
  initialState,
  reducers: {
    setPopularPicks: (state, action: PayloadAction<Product[]>) => {
      state.popularPicks = Array.isArray(action.payload) ? action.payload : [];
    },
    setNewArrivals: (state, action: PayloadAction<Product[]>) => {
      state.newArrivals = Array.isArray(action.payload) ? action.payload : [];
    },
    setTopUsers: (state, action: PayloadAction<Member[]>) => {
      state.topUsers = Array.isArray(action.payload) ? action.payload : [];
    },
  },
});

export const { setPopularPicks, setNewArrivals, setTopUsers } =
  homePageSlice.actions;

const homePageReducer = homePageSlice.reducer;
export default homePageReducer;
