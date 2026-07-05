import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createOrder, resetSuccess } from "../redux/slices/orderSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import Loader from "./layout/Loader";
import Message from "./Message";

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const dispatch = useDispatch();

  const { loading, error, success, order } = useSelector((state) => state.order);

  useEffect(() => {
    if (sessionId) {
      dispatch(createOrder({ session_id: sessionId }));
    }
    return () => {
      dispatch(resetSuccess());
    };
  }, [sessionId, dispatch]);

  return (
    <div className="success-container d-flex flex-column align-items-center justify-content-center my-5">
      {loading ? (
        <div className="text-center">
          <Loader />
          <h4 className="mt-3 text-muted">Confirming your payment with Stripe...</h4>
          <p className="text-muted small">Please do not refresh the page or click back.</p>
        </div>
      ) : error ? (
        <div className="card shadow-lg p-5 text-center success-card border-danger">
          <FontAwesomeIcon icon={faTimesCircle} className="text-danger mb-4" size="4x" />
          <h2 className="text-danger mb-2">Order Creation Failed</h2>
          <Message variant="danger">{error}</Message>
          <p className="mt-3 text-muted">
            If payment was deducted, please contact support with session ID:
          </p>
          <code className="d-block bg-light p-2 mb-4 rounded text-break">{sessionId}</code>
          <Link to="/cart" className="auth-btn btn-danger">
            Return to Cart
          </Link>
        </div>
      ) : success || order ? (
        <div className="card shadow-lg p-5 text-center success-card">
          <FontAwesomeIcon icon={faCheckCircle} className="text-success mb-4 animate-bounce" size="4x" />
          <h2 className="mb-2 font-weight-bold">Payment Successful!</h2>
          <p className="lead text-success font-weight-semibold mb-4">
            Your order has been placed successfully.
          </p>

          <div className="order-details text-left bg-light p-4 rounded mb-4">
            <h5 className="border-bottom pb-2 mb-3">Order Confirmation</h5>
            <p className="mb-1 text-muted">
              Order ID: <strong className="text-dark">{order?._id || "Processing..."}</strong>
            </p>
            <p className="mb-1 text-muted">
              Status: <span className="badge badge-success px-2 py-1">Paid & Processing</span>
            </p>
            {order?.finalTotal && (
              <p className="mb-0 text-muted">
                Total Paid: <strong className="text-dark">₹{order.finalTotal}</strong>
              </p>
            )}
          </div>

          <p className="text-muted mb-4">
            Thank you for ordering with us! We have notified the restaurant and your delivery agent.
          </p>

          <div className="d-flex gap-3 justify-content-center">
            <Link to="/" className="auth-btn mr-2">
              Browse More Restaurants
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <Loader />
          <h4 className="mt-3 text-muted">Verifying payment details...</h4>
        </div>
      )}
    </div>
  );
};

export default Success;
