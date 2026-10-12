import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartState, Product } from "../../types";
import type { RootState } from "../store";

const initialCartState: CartState = {
  items: [],
};

export type AddToCartPayload =
  | Product
  | {
    id: number;
    title: string;
    price: number;
    image?: string;
    images?: string[];
    quantity?: number;
  };

export const CartSlice = createSlice({
  name: "cart",
  initialState: initialCartState,
  reducers: {
    addToCart(state, action: PayloadAction<AddToCartPayload>) {
      const payload = action.payload;
      const existingItem = state.items.find((item) => item.id === payload.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        const image =
          "image" in payload && payload.image
            ? payload.image
            : "images" in payload && payload.images && payload.images.length > 0
              ? payload.images[0]
              : "";

        state.items.push({
          id: Number(payload.id),
          title: payload.title,
          price: Number(payload.price),
          image,
          quantity: 1,
        });
      }
    },

    increaseQuantity(state, action: PayloadAction<number>) {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },

    decreaseQuantity(state, action: PayloadAction<number>) {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter((i) => i.id !== action.payload);
        }
      }
    },

    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },

    clearCart(state) {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = CartSlice.actions;

export const cartReducer = CartSlice.reducer;

export const selectCartItems = (state: RootState) => state.cart.items;

export const selectCartTotalQuantity = (state: RootState): number =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const selectCartTotalAmount = (state: RootState): number =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

export const selectCartItemQuantity = (id: number) => (state: RootState): number => {
  const item = state.cart.items.find((i) => i.id === id);
  return item ? item.quantity : 0;
};
