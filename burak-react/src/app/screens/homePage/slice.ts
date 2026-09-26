import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface HomePageState {
  popularDishes: any[];
  newDishes: any[];
  topUsers: any[];
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
    setPopularDishes: (state, action: PayloadAction<any[]>) => {
      state.popularDishes = action.payload;
    },
    setNewDishes: (state, action: PayloadAction<any[]>) => {
      state.newDishes = action.payload;
    },
    setTopUsers: (state, action: PayloadAction<any[]>) => {
      state.topUsers = action.payload;
    },
  },
});

export const { setPopularDishes, setNewDishes, setTopUsers } =
  homePageSlice.actions;

const homePageReducer = homePageSlice.reducer;
export default homePageReducer;
