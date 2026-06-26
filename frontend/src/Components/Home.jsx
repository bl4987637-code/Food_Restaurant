import React, { useEffect } from "react";
import {
  sortByRatings,
  sortByReviews,
  toggleVegOnly,
} from "../redux/slices/restaurantSlice";
import { getRestaurants } from "../redux/actions/restaurantAction";

import Restaurant from "./Restaurant";
import Loader from "./layout/Loader";
import Message from "./Message";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const { keyword } = useParams();

  const {
    loading: restaurantsLoading,
    error: restaurantsError,
    restaurants,
    showVegOnly,
    sortBy,
  } = useSelector((state) => state.restaurants);

  useEffect(() => {
    dispatch(getRestaurants(keyword));
  }, [dispatch, keyword]);

  const handleSortByRatings = () => {
    dispatch(sortByRatings());
  };

  const handleSortByReviews = () => {
    dispatch(sortByReviews());
  };

  const handleToggleVegOnly = () => {
    dispatch(toggleVegOnly());
  };

  const filteredRestaurants = restaurants.filter(
    (restaurant) => !showVegOnly || restaurant.isVeg
  );

  return (
    <>
      {restaurantsLoading ? (
        <Loader />
      ) : restaurantsError ? (
        <Message variant="danger">{restaurantsError}</Message>
      ) : (
        <section>
          <div className="sort">
            <button
              className={`sort_veg p-3 ${showVegOnly ? "sort-active" : ""}`}
              onClick={handleToggleVegOnly}
            >
              {showVegOnly ? "Show All" : "Pure Veg"}
            </button>

            <button
              className={`sort_rev p-3 ${sortBy === "reviews" ? "sort-active" : ""}`}
              onClick={handleSortByReviews}
            >
              Sort By Reviews
            </button>

            <button
              className={`sort_rate p-3 ${sortBy === "ratings" ? "sort-active" : ""}`}
              onClick={handleSortByRatings}
            >
              Sort By Ratings
            </button>
          </div>

          <div className="row mt-4">
            {filteredRestaurants.length > 0 ? (
              filteredRestaurants.map((restaurant) => (
                <Restaurant key={restaurant._id} restaurant={restaurant} />
              ))
            ) : (
              <Message variant="info">No restaurants Found.</Message>
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default Home;
