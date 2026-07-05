import React, { useEffect } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Search from "./Search";
import { logoutUser } from "../../redux/slices/userSlice";
import { getCart } from "../../redux/slices/cartSlice";
import { toast } from "react-toastify";
import "../../App.css";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);

  const cartCount =
    cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCart());
    }
  }, [dispatch, isAuthenticated]);

  const logoutHandler = async () => {
    await dispatch(logoutUser());
    toast.info("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="navbar row sticky-top">
      <div className="col-12 col-md-3">
        <Link to="/" className="brand-logo">
          <span className="brand-icon">🍽️</span>
          <span className="brand-text">EatEasy</span>
        </Link>
      </div>

      <div className="col-12 col-md-6 mt-2 mt-md-0">
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/eats/stores/search/:keyword" element={<Search />} />
        </Routes>
      </div>

      <div className="col-12 col-md-3 mt-4 mt-md-0 text-center header-actions">
        {isAuthenticated ? (
          <>
            <Link to="/cart" className="cart-link">
              <span id="cart">Cart</span>
              <span className="cart-badge">{cartCount}</span>
            </Link>
            <span className="user-greeting">Hi, {user?.name?.split(" ")[0]}</span>
            <button className="logout-btn" onClick={logoutHandler} type="button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/users/login" className="auth-link">
              Login
            </Link>
            <Link to="/users/register" className="auth-link register-link">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
