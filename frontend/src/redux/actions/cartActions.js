import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const addToCart = createAsyncThunk(
  "cart/add",
  async ({ foodItemId, restaurantId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/v1/eats/cart/add-to-cart", {
        foodItemId,
        restaurantId,
        quantity,
      });
      return data.cart;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Unable to add to cart"
      );
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async (foodItemId, { rejectWithValue }) => {
    try {
      const { data } = await api.delete("/v1/eats/cart/delete-cart-item", {
        data: { foodItemId },
      });
      return data.cart ?? null;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Unable to remove item"
      );
    }
  }
);

export const getCart = createAsyncThunk(
  "cart/get",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/v1/eats/cart/get-cart");
      return data.data;
    } catch (err) {
      if (err.response?.status === 404) {
        return null;
      }
      return rejectWithValue(
        err.response?.data?.message || "Unable to fetch cart"
      );
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/update",
  async ({ foodItemId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/v1/eats/cart/update-cart-item", {
        foodItemId,
        quantity,
      });
      return data.cart;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Unable to update cart"
      );
    }
  }
);
