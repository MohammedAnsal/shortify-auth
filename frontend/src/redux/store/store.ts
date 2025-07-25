import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "../slice/userSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Define the persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // Persist user, admin
};

// Combine all slice reducers into a single root reducer
const rootReducer = combineReducers({
  user: userReducer,
});

// Apply the persistReducer to the root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Export persistor to use with PersistGate in your main app file
export const persistor = persistStore(store);

// Types for root state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
