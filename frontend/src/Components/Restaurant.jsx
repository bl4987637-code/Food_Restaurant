import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getImageUrl, RESTAURANT_PLACEHOLDER } from "../utils/imageUtils";
import { generateReviewSummary } from "../redux/actions/restaurantAction";

const Restaurant = ({ restaurant }) => {
  const dispatch = useDispatch();
  const [showAI, setShowAI] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    getImageUrl(restaurant?.images, RESTAURANT_PLACEHOLDER)
  );

  const summaryLoading = useSelector(
    (state) => state.restaurants.summaryLoading[restaurant?._id]
  );
  const summaryError = useSelector(
    (state) => state.restaurants.summaryError[restaurant?._id]
  );

  if (!restaurant) return null;

  const hasSummary = Boolean(restaurant.reviewSentiment);

  const handleSummaryClick = async () => {
    if (summaryLoading) return;

    if (hasSummary) {
      setShowAI((prev) => !prev);
      return;
    }

    await dispatch(generateReviewSummary(restaurant._id));
    setShowAI(true);
  };

  return (
    <div className="col-12 my-3">
      <div className="card restaurant-card p-3">
        <Link to={`/eats/stores/${restaurant._id}/menus`}>
          <img
            className="restaurant-image"
            src={imgSrc}
            alt={restaurant.name || "Restaurant"}
            referrerPolicy="no-referrer"
            onError={() => setImgSrc(RESTAURANT_PLACEHOLDER)}
          />
        </Link>

        <div className="restaurant-info">
          <h4>{restaurant.name || "Unnamed Restaurant"}</h4>
          <p className="rest_address">
            {restaurant.address || "No address available"}
          </p>

          <div className="ratings">
            <div className="rating-outer">
              <div
                className="rating-inner"
                style={{
                  width: `${((restaurant.ratings || 0) / 5) * 100}%`,
                }}
              ></div>
            </div>
            <span>({restaurant.numOfReviews || 0} Reviews)</span>
          </div>

          <button
            className="ai-btn"
            onClick={handleSummaryClick}
            disabled={summaryLoading}
          >
            {summaryLoading
              ? "✨ Generating..."
              : showAI
                ? "➖ Hide Summary"
                : hasSummary
                  ? "💬 View Review Summary"
                  : "✨ Generate AI Summary"}
          </button>

          {summaryError && (
            <p className="text-danger mt-2 mb-0">{summaryError}</p>
          )}
        </div>

        {showAI && (
          <div className="ai-insights-box">
            {summaryLoading ? (
              <p className="mb-0">✨ Generating AI review summary...</p>
            ) : hasSummary ? (
              <>
                <div className="ai-status">
                  Review Summary: 😊{" "}
                  <strong>{restaurant.reviewSentiment}</strong>
                </div>

                <ul>
                  {(restaurant.reviewSummaryBullets || []).map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>

                <div className="mentions">
                  {(restaurant.reviewTopMentions || []).map((item, index) => (
                    <span key={index} className="mention-tag">
                      #{item}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <p className="mb-0 text-danger">Could not load summary.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurant;
