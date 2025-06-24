import express from "express";
import { initiateVendorPayment, verifyPayment } from "../Controllers/Payment_Con.js";

const paymentRoute = express.Router();

paymentRoute.post("/initiate", initiateVendorPayment);
paymentRoute.get('/verify/:reference', verifyPayment)

export default paymentRoute;
