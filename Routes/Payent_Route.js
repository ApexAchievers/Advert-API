// routes/Payent_Route.js
import express from "express";
import {
  initiateVendorPayment
} from "../Controllers/Payment_Con.js";

const paymentRoute = express.Router();

paymentRoute.post("/initiate", initiateVendorPayment);


export default paymentRoute;
