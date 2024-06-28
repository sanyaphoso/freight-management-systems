// systemStore.ts
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface SystemCounterState {
  sidebarOpen: boolean;
  expandMenu: string[];
}

const initialState: SystemCounterState = {
  sidebarOpen: false,
  expandMenu: [],
};

export const systemStore = createSlice({
  name: "counter",
  initialState,
  reducers: {
    sidebarIsOpen: (state) => {
      state.sidebarOpen = true;
    },
    sidebarIsClose: (state) => {
      state.sidebarOpen = false;
    },
    sidebarIsToggle: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    expandMenuIsOpen: (state, action: PayloadAction<string>) => {
      state.expandMenu = [action.payload];
    },
  },
});

export const {
  sidebarIsClose,
  sidebarIsOpen,
  sidebarIsToggle,
  expandMenuIsOpen,
} = systemStore.actions;

export default systemStore.reducer;
