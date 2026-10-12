import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState } from "../../types";

export type LoginPayload = AuthState;
export type { AuthState };

const authInitialState: AuthState = {
  email: '',
  password: '',
};

export const AuthSlice = createSlice({
  name: 'auth',
  initialState: authInitialState,
  reducers: {
    storeAuthCredentials(state, action: PayloadAction<AuthState>) {
      state.email = action.payload.email;
      state.password = action.payload.password;
    },
    clearAuthCredentials(state) {
      state.email = '';
      state.password = '';
    },
  },
});

export const { storeAuthCredentials, clearAuthCredentials } = AuthSlice.actions;
export const authReducer = AuthSlice.reducer;
