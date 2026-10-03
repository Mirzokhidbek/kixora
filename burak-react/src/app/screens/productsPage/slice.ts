import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../../lib/types/product";
import type { Member } from "../../../lib/types/member";

interface ProductsPageState {
  restaurant: Member | null;
  chosenProduct: Product | null;
  products: Product[];
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
    setRestaurant: (state, action: PayloadAction<Member | null>) => {
      state.restaurant = action.payload;
    },
    setChosenProduct: (state, action: PayloadAction<Product | null>) => {
      state.chosenProduct = action.payload;
    },
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
  },
});

export const { setRestaurant, setChosenProduct, setProducts } =
  productsPageSlice.actions;

const productsPageReducer = productsPageSlice.reducer;
export default productsPageReducer;
