import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { getImageUrl, FOOD_PLACEHOLDER } from "../utils/imageUtils";

const Fooditem = ({ fooditem }) => {
  const [quantity, setQuantity] = useState(1);
  const [showButtons, setShowButtons] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    getImageUrl(fooditem?.images, FOOD_PLACEHOLDER)
  );

  const addToCartHandler = () => {
    setShowButtons(true);
    setQuantity(1);
  };

  const increaseQty = () => {
    if (quantity < fooditem.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    } else {
      setShowButtons(false);
      setQuantity(1);
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
              disabled={fooditem.stock === 0}
              onClick={addToCartHandler}
            >
              Add to Cart
            </button>
          ) : (
            <div className="qty-controls">
              <button className="qty-btn" onClick={decreaseQty}>
                -
              </button>

              <input
                type="number"
                className="qty-input"
                value={quantity}
                readOnly
              />

              <button className="qty-btn" onClick={increaseQty}>
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
