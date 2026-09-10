import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface OrdersPageState {
  pausedOrders: any[];
  processOrders: any[];
  finishedOrders: any[];
}

const initialState: OrdersPageState = {
  pausedOrders: [],
  processOrders: [],
  finishedOrders: [],
};

export const ordersPageSlice = createSlice({
  name: "ordersPage",
  initialState,
  reducers: {
    setPausedOrders: (state, action: PayloadAction<any[]>) => {
      state.pausedOrders = Array.isArray(action.payload) ? action.payload : [];
    },
    setProcessOrders: (state, action: PayloadAction<any[]>) => {
      state.processOrders = Array.isArray(action.payload) ? action.payload : [];
    },
    setFinishedOrders: (state, action: PayloadAction<any[]>) => {
      state.finishedOrders = Array.isArray(action.payload) ? action.payload : [];
    },
  },
});

export const { setPausedOrders, setProcessOrders, setFinishedOrders } =
  ordersPageSlice.actions;

const ordersPageReducer = ordersPageSlice.reducer;
export default ordersPageReducer;
