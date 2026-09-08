import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../../lib/types/product";
import type { Member } from "../../../lib/types/member";

interface HomePageState {
  popularDishes: Product[];
  newDishes: Product[];
  topUsers: Member[];
}

const initialState: HomePageState = {
  popularDishes: [],
  newDishes: [],
  topUsers: [],
};

export const homePageSlice = createSlice({
  name: "homePage",
  initialState,
  reducers: {
    setPopularDishes: (state, action: PayloadAction<Product[]>) => {
      state.popularDishes = action.payload;
    },
    setNewDishes: (state, action: PayloadAction<Product[]>) => {
      state.newDishes = action.payload;
    },
    setTopUsers: (state, action: PayloadAction<Member[]>) => {
      state.topUsers = action.payload;
    },
  },
});

export const { setPopularDishes, setNewDishes, setTopUsers } =
  homePageSlice.actions;

const homePageReducer = homePageSlice.reducer;
export default homePageReducer;
