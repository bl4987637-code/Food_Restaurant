import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { getImageUrl, FOOD_PLACEHOLDER } from "../utils/imageUtils";
import {
  addToCart,
  updateCartQuantity,
  removeFromCart,
} from "../redux/slices/cartSlice";

const Fooditem = ({ fooditem, restaurant }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  const { cart, loading } = useSelector((state) => state.cart);

  const cartItem = cart?.items?.find(
    (item) => item.foodItem?._id === fooditem._id
  );
  const quantity = cartItem?.quantity || 0;
  const showButtons = quantity > 0;

  const [imgSrc, setImgSrc] = useState(
    getImageUrl(fooditem?.images, FOOD_PLACEHOLDER)
  );

  const requireAuth = () => {
    toast.info("Please login to use your cart");
    navigate("/users/login");
    return false;
  };

  const addToCartHandler = async () => {
    if (!isAuthenticated && !requireAuth()) return;

    const result = await dispatch(
      addToCart({
        foodItemId: fooditem._id,
        restaurantId: restaurant,
        quantity: 1,
      })
    );

    if (addToCart.fulfilled.match(result)) {
      toast.success(`${fooditem.name} added to cart`);
    } else {
      toast.error(result.payload || "Could not add to cart");
    }
  };

  const increaseQty = async () => {
    if (!isAuthenticated) return;
    if (quantity < fooditem.stock) {
      await dispatch(
        updateCartQuantity({
          foodItemId: fooditem._id,
          quantity: quantity + 1,
        })
      );
    }
  };

  const decreaseQty = async () => {
    if (!isAuthenticated) return;

    if (quantity > 1) {
      await dispatch(
        updateCartQuantity({
          foodItemId: fooditem._id,
          quantity: quantity - 1,
        })
      );
    } else {
      await dispatch(removeFromCart(fooditem._id));
      toast.info("Item removed from cart");
    }
  };

  return (
    <div className="col-sm-12 col-md-6 col-lg-4 my-4">
      <div className="premium-card">
        <div className="food-img-container">
          <img
            src={imgSrc}
            alt={fooditem.name}
            referrerPolicy="no-referrer"
            onError={() => setImgSrc(FOOD_PLACEHOLDER)}
          />
          <div className="food-price-badge">
            <FontAwesomeIcon icon={faIndianRupeeSign} size="sm" /> {fooditem.price}
          </div>
        </div>

        <div className="premium-card-body">
          <h5 className="food-title">{fooditem.name}</h5>
          <p className="food-desc">{fooditem.description}</p>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <span
              className={`status-badge ${fooditem.stock > 0 ? "status-in" : "status-out"}`}
            >
              {fooditem.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {!showButtons ? (
            <button
              type="button"
              className="premium-btn"
              disabled={fooditem.stock === 0 || loading}
              onClick={addToCartHandler}
            >
              Add to Cart
            </button>
          ) : (
            <div className="qty-controls">
              <button className="qty-btn" onClick={decreaseQty} disabled={loading}>
                -
              </button>
              <input
                type="number"
                className="qty-input"
                value={quantity}
                readOnly
              />
              <button className="qty-btn" onClick={increaseQty} disabled={loading}>
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Fooditem;
