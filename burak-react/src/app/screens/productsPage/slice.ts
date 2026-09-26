import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ProductsPageState {
  restaurant: any | null;
  chosenProduct: any | null;
  products: any[];
}

const initialState: ProductsPageState = {
  restaurant: null,
  chosenProduct: null,
  products: [],
};

export const productsPageSlice = createSlice({
  name: "productsPage",
  initialState,
  reducers: {
    setRestaurant: (state, action: PayloadAction<any>) => {
      state.restaurant = action.payload;
    },
    setChosenProduct: (state, action: PayloadAction<any>) => {
      state.chosenProduct = action.payload;
    },
    setProducts: (state, action: PayloadAction<any[]>) => {
      state.products = action.payload;
    },
  },
});

export const { setRestaurant, setChosenProduct, setProducts } =
  productsPageSlice.actions;

const productsPageReducer = productsPageSlice.reducer;
export default productsPageReducer;
