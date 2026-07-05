import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import {
  getCart,
  removeFromCart,
  updateCartQuantity,
} from "../redux/slices/cartSlice";
import { getImageUrl, FOOD_PLACEHOLDER } from "../utils/imageUtils";
import Loader from "./layout/Loader";
import Message from "./Message";
import api from "../utils/api";
import { toast } from "react-toastify";

const Cart = () => {
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const items = cart?.items || [];
  const restaurantName = cart?.restaurant?.name || "Restaurant";

  const total = items.reduce((sum, item) => {
    const price = item.foodItem?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const handleRemove = (foodItemId) => {
    dispatch(removeFromCart(foodItemId));
  };

  const handleQuantityChange = (foodItemId, quantity) => {
    if (quantity < 1) return;
    dispatch(updateCartQuantity({ foodItemId, quantity }));
  };

  if (loading && !cart) {
    return <Loader />;
  }

  return (
    <div className="cart-page container my-4">
      <h2 className="mb-3">Your Cart</h2>
      <p className="text-muted">
        Your cart saves food items from one restaurant until you checkout and place an order.
      </p>

      {error && <Message variant="danger">{error}</Message>}

      {!cart || items.length === 0 ? (
        <div className="empty-cart">
          <Message variant="info">Your cart is empty.</Message>
          <Link to="/" className="auth-btn d-inline-block mt-3">
            Browse Restaurants
          </Link>
        </div>
      ) : (
        <>
          <p className="cart-restaurant-name">
            Ordering from: <strong>{restaurantName}</strong>
          </p>

          <div className="cart-items">
            {items.map((item) => (
              <div key={item.foodItem._id} className="cart-item card p-3 mb-3">
                <div className="row align-items-center">
                  <div className="col-md-2">
                    <img
                      src={getImageUrl(item.foodItem?.images, FOOD_PLACEHOLDER)}
                      alt={item.foodItem?.name}
                      className="cart-item-img"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="col-md-4">
                    <h5>{item.foodItem?.name}</h5>
                    <p className="mb-0">
                      <FontAwesomeIcon icon={faIndianRupeeSign} size="sm" />
                      {item.foodItem?.price} each
                    </p>
                  </div>
                  <div className="col-md-3">
                    <div className="qty-controls">
                      <button
                        className="qty-btn"
                        onClick={() =>
                          handleQuantityChange(
                            item.foodItem._id,
                            item.quantity - 1
                          )
                        }
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className="qty-input"
                        value={item.quantity}
                        readOnly
                      />
                      <button
                        className="qty-btn"
                        onClick={() =>
                          handleQuantityChange(
                            item.foodItem._id,
                            item.quantity + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="col-md-2 text-md-right">
                    <strong>
                      <FontAwesomeIcon icon={faIndianRupeeSign} size="sm" />
                      {item.foodItem?.price * item.quantity}
                    </strong>
                  </div>
                  <div className="col-md-1 text-md-right">
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleRemove(item.foodItem._id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary card p-4">
            <h4>
              Total: <FontAwesomeIcon icon={faIndianRupeeSign} size="sm" />
              {total}
            </h4>
            <p className="text-muted mb-3">
              Proceed to checkout when you are ready to place your order.
            </p>
            <button
              className="auth-btn"
              type="button"
              disabled={checkoutLoading}
              onClick={async () => {
                try {
                  setCheckoutLoading(true);
                  const { data } = await api.post("/v1/payment/process", {
                    items: cart.items,
                  });
                  if (data && data.url) {
                    window.location.href = data.url;
                  } else {
                    toast.error("Failed to initiate payment session");
                    setCheckoutLoading(false);
                  }
                } catch (err) {
                  toast.error(err.response?.data?.message || err.message || "Checkout failed");
                  setCheckoutLoading(false);
                }
              }}
            >
              {checkoutLoading ? "Redirecting to Stripe..." : "Proceed to Checkout"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
