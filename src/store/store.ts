import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/AuthSlice";
import { cartReducer } from "./slices/CartSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const getStorage = () => {
  if (typeof window === 'undefined') {
    return {
      getItem: () => Promise.resolve(null),
      setItem: (_key: string, value: string) => Promise.resolve(value),
      removeItem: () => Promise.resolve(),
    };
  }
  const webStorage = (storage as any)?.default ?? storage;
  if (webStorage && typeof webStorage.getItem === 'function') {
    return webStorage;
  }
  return {
    getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
    setItem: (key: string, item: string) => Promise.resolve(localStorage.setItem(key, item)),
    removeItem: (key: string) => Promise.resolve(localStorage.removeItem(key)),
  };
};

export const RESET_STORE = 'RESET_STORE';
export const resetStore = () => ({ type: RESET_STORE });

const appReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
});

const rootReducer: typeof appReducer = (state, action) => {
  if (action.type === 'auth/clearAuthCredentials' || action.type === RESET_STORE) {
    state = undefined;
  }
  return appReducer(state, action);
};

const persistConfig = {
  key: 'root',
  storage: getStorage(),
  whitelist: ['auth', 'cart'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;