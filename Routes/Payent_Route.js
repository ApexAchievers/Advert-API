// routes/Payent_Route.js
import express from "express";
import {
  initiateVendorPayment,
  markUserAsPaid,
} from "../Controllers/Payment_Con.js";

const paymentRoute = express.Router();

paymentRoute.post("/initiate", initiateVendorPayment);
paymentRoute.post("/mark-paid", markUserAsPaid); // NEW ROUTE

export default paymentRoute;
