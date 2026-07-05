const express = require("express");
const app = express();

const path = require("path");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");

const errorMiddleware = require("./middlewares/errors");
const ErrorHandler = require("./utils/errorHandler");

// Routes
const foodRouter = require("./routes/foodItem");
const restaurant = require("./routes/restaurant");
const menuRouter = require("./routes/menu");
const order = require("./routes/order");
const auth = require("./routes/auth");
const payment = require("./routes/payment");
const cart = require("./routes/cart");

// Middlewares
app.use(
  cors({
    origin: function (origin, callback) {
      const frontendUrl = (process.env.FRONTEND_URL || "").replace(/"/g, "").trim();
      const allowed = [
        "http://localhost:5173",
        "http://localhost:5174",
        frontendUrl,
      ].filter(Boolean);

      // Allow requests with no origin (mobile apps, curl, etc.) or matching origins
      if (!origin || allowed.includes(origin) || (origin && origin.endsWith(".onrender.com"))) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(fileUpload());

app.use(express.json({ limit: "30kb" }));
app.use(express.urlencoded({ extended: true, limit: "30kb" }));

// Routes
app.use("/api/v1/eats", foodRouter);
app.use("/api/v1/eats/menus", menuRouter);
app.use("/api/v1/eats/stores", restaurant);
app.use("/api/v1/eats/orders", order);
app.use("/api/v1/users", auth);
app.use("/api/v1", payment);
app.use("/api/v1/eats/cart", cart);


// View Engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// 404 Handler
app.use((req, res, next) => {
  next(new ErrorHandler(`Route ${req.originalUrl} not found`, 404));
});


// Global Error Handler
app.use(errorMiddleware);

module.exports = app;