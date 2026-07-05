const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

async function testStripe() {
  try {
    console.log("Testing Stripe Secret Key...");
    const balance = await stripe.balance.retrieve();
    console.log("Stripe Connection Successful!");
    console.log("Available Balance:", balance.available);
  } catch (error) {
    console.error("Stripe Connection Failed:", error.message);
  }
}

testStripe();
