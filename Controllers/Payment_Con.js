// controllers/paymentController.js
import axios from "axios";
import crypto from "crypto";
import { User } from "../Models/User_Mod.js";

// === INITIATE PAYMENT ===
export const initiateVendorPayment = async (req, res) => {
  const { email, fullname } = req.body;

  if (!email || !fullname) {
    return res.status(400).json({ message: "Email and fullname are required" });
  }

  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: 5000 * 100,
        metadata: {
          fullname,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({
      message: "Payment initiated",
      url: response.data.data.authorization_url,
      reference: response.data.data.reference,
    });
  } catch (err) {
    console.error("Paystack INIT error:", err.response?.data || err.message);
    res.status(500).json({
      message: "Paystack error",
      error: err.response?.data || err.message,
    });
  }
};

// === HANDLE PAYSTACK WEBHOOK ===
export const handlePaystackWebhook = async (req, res) => {
  const secret = process.env.PAYSTACK_SECRET_KEY;

  const hash = crypto
    .createHmac("sha512", secret)
    .update(req.body)
    .digest("hex");

  if (hash !== req.headers["x-paystack-signature"]) {
    return res.status(400).json({ message: "Invalid webhook signature" });
  }

  const event = req.body;

  if (event.event === "charge.success") {
    const email = event.data.customer.email?.toLowerCase();
    const reference = event.data.reference;

    try {
      const user = await User.findOneAndUpdate(
        { email },
        {
          paymentStatus: "paid",
          paymentReference: reference,
        },
        { new: true }
      );

      if (user) {
        console.log("✔ User payment updated automatically for:", email);
      } else {
        console.warn("⚠ User not found for webhook update:", email);
      }
    } catch (err) {
      console.error("Webhook user update error:", err.message);
    }
  }

  res.sendStatus(200);
};
