import { configureStore } from "@reduxjs/toolkit";
import systemStore from "./systemStore";

export const store = configureStore({
  reducer: {
    systemStore: systemStore,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
