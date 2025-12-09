import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "@sbm/api-client";

export const webStore = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type WebRootState = ReturnType<typeof webStore.getState>;
export type WebAppDispatch = typeof webStore.dispatch;
