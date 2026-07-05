import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const createOrder = createAsyncThunk(
  "order/create",
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/v1/eats/orders/new", orderData);
      return data.order;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Order creation failed"
      );
    }
  }
);

export const getOrder = createAsyncThunk(
  "order/get",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/v1/eats/orders/${id}`);
      return data.order;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Unable to fetch order"
      );
    }
  }
);

export const myOrders = createAsyncThunk(
  "order/myOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/v1/eats/orders/me/myOrders");
      return data.orders;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Unable to fetch your orders"
      );
    }
  }
);
