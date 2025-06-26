import express from "express";
import { initiateVendorPayment, handlePaystackWebhook } from "../Controllers/Payment_Con.js";

const paymentRoute = express.Router();

// Route to initiate vendor payment
paymentRoute.post("/initiate", initiateVendorPayment);

// Route to handle Paystack webhook (must come before express.json middleware in main app)
paymentRoute.post("/webhook", express.raw({ type: "application/json" }), // raw body for signature verification
  handlePaystackWebhook
);

export default paymentRoute;
