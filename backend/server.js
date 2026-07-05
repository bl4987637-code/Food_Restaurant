const path = require("path");
const dotenv = require("dotenv");

// Setting up config file FIRST - before requiring app
// Use absolute path to ensure it works from any directory
dotenv.config({ path: path.join(__dirname, "config/config.env") });

const app = require("./app");
const connectDatabase = require("./config/database");

// Handle Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.stack}`);
  console.log("Shutting down server due to uncaught exception");
  process.exit(1);
});

// Connecting to database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});

// Handle Unhandled Promise Rejections
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log("Shutting down the server due to Unhandled Promise rejection");

  server.close(() => {
    process.exit(1);
  });
});