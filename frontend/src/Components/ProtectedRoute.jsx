import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./layout/Loader";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAuthChecked } = useSelector((state) => state.user);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/users/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
