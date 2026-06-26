import { createSlice } from "@reduxjs/toolkit";

const sortRestaurants = (restaurants, sortBy) => {
  const sorted = [...restaurants];

  if (sortBy === "ratings") {
    return sorted.sort((a, b) => (b.ratings || 0) - (a.ratings || 0));
  }

  if (sortBy === "reviews") {
    return sorted.sort((a, b) => (b.numOfReviews || 0) - (a.numOfReviews || 0));
  }

  return sorted;
};

const initialState = {
  restaurants: [],
  count: 0,
  loading: false,
  error: null,
  showVegOnly: false,
  sortBy: null,
  pureVegRestaurantsCount: 0,
  creating: false,
  createError: null,
  deleting: false,
  deleteError: null,
  summaryLoading: {},
  summaryError: {},
};

const restaurantSlice = createSlice({
  name: "restaurants",
  initialState,
  reducers: {
    getRestaurantsRequest: (state) => {
      state.loading = true;
    },
    getRestaurantsSuccess: (state, action) => {
      state.loading = false;
      state.restaurants = sortRestaurants(
        action.payload.restaurants,
        state.sortBy
      );
      state.count = action.payload.count;
    },
    getRestaurantsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    createRestaurantRequest: (state) => {
      state.creating = true;
    },
    createRestaurantSuccess: (state, action) => {
      state.creating = false;
      state.restaurants.push(action.payload);
      state.count += 1;
      state.restaurants = sortRestaurants(state.restaurants, state.sortBy);
    },
    createRestaurantFail: (state, action) => {
      state.creating = false;
      state.createError = action.payload;
    },

    deleteRestaurantRequest: (state) => {
      state.deleting = true;
    },
    deleteRestaurantSuccess: (state, action) => {
      state.deleting = false;
      state.restaurants = state.restaurants.filter(
        (restaurant) => restaurant._id !== action.payload
      );
      state.count -= 1;
    },
    deleteRestaurantFail: (state, action) => {
      state.deleting = false;
      state.deleteError = action.payload;
    },

    sortByRatings: (state) => {
      state.sortBy = "ratings";
      state.restaurants = sortRestaurants(state.restaurants, "ratings");
    },

    sortByReviews: (state) => {
      state.sortBy = "reviews";
      state.restaurants = sortRestaurants(state.restaurants, "reviews");
    },

    clearSort: (state) => {
      state.sortBy = null;
    },

    toggleVegOnly: (state) => {
      state.showVegOnly = !state.showVegOnly;
    },

    generateSummaryRequest: (state, action) => {
      state.summaryLoading[action.payload] = true;
      state.summaryError[action.payload] = null;
    },
    generateSummarySuccess: (state, action) => {
      const { id, summary } = action.payload;
      state.summaryLoading[id] = false;

      const index = state.restaurants.findIndex((r) => r._id === id);
      if (index !== -1) {
        state.restaurants[index] = {
          ...state.restaurants[index],
          ...summary,
        };
      }
    },
    generateSummaryFail: (state, action) => {
      const { id, error } = action.payload;
      state.summaryLoading[id] = false;
      state.summaryError[id] = error;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  getRestaurantsRequest,
  getRestaurantsSuccess,
  getRestaurantsFail,

  createRestaurantRequest,
  createRestaurantSuccess,
  createRestaurantFail,

  deleteRestaurantRequest,
  deleteRestaurantSuccess,
  deleteRestaurantFail,

  sortByRatings,
  sortByReviews,
  clearSort,
  toggleVegOnly,

  generateSummaryRequest,
  generateSummarySuccess,
  generateSummaryFail,

  clearError,
} = restaurantSlice.actions;

export default restaurantSlice.reducer;
