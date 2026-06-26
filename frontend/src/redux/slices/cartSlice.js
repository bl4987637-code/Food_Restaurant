import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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
      return rejectWithValue(err.response?.data?.message || "Unable to add to cart");
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
      return rejectWithValue(err.response?.data?.message || "Unable to remove item");
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
      return rejectWithValue(err.response?.data?.message || "Unable to fetch cart");
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
      return rejectWithValue(err.response?.data?.message || "Unable to update cart");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.cart = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.cart = action.payload;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.cart = action.payload;
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetSuccess } = cartSlice.actions;
export default cartSlice.reducer;
