import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import Home from "./Components/Home";
import Header from "./Components/layout/Header";
import Footer from "./Components/layout/Footer";
import Menu from "./Components/Menu";
import Login from "./Components/auth/Login";
import Register from "./Components/auth/Register";
import Cart from "./Components/Cart";
import Success from "./Components/Success";
import ProtectedRoute from "./Components/ProtectedRoute";
import { loadUser } from "./redux/slices/userSlice";
import { getCart } from "./redux/slices/cartSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser()).then((result) => {
      if (loadUser.fulfilled.match(result)) {
        dispatch(getCart());
      }
    });
  }, [dispatch]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <div className="App">
          <Header />
          <div className="container container-fluids">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/eats/stores/search/:keyword"
                element={<Home />}
              />
              <Route path="/eats/stores/:id/menus" element={<Menu />} />
              <Route path="/users/login" element={<Login />} />
              <Route path="/users/register" element={<Register />} />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/success"
                element={
                  <ProtectedRoute>
                    <Success />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </>
  );
}

export default App;
