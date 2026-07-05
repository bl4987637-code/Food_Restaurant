// Diagnostic: what DB is the server actually using?
const app = require("./app");
const connectDatabase = require("./config/database");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config/config.env" });

connectDatabase().then(async () => {
  console.log("=== DB DIAGNOSTIC ===");
  console.log("DB_URI (safe):", process.env.DB_URI ? process.env.DB_URI.replace(/\/\/[^:]+:[^@]+@/, '//USER:PASS@') : "UNDEFINED");
  console.log("Connected DB name:", mongoose.connection.db.databaseName);
  
  const Restaurant = require("./models/restaurant");
  const count = await Restaurant.countDocuments();
  console.log("Restaurant count:", count);
  console.log("===================");
  process.exit(0);
});
