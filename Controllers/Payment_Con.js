// controllers/paymentController.js
import axios from "axios";
import { User } from "../Models/User_Mod.js";

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
        amount: 5000 * 100, // GHS 50
        metadata: { fullname },
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
    res.status(500).json({ message: "Paystack error", error: err.message });
  }
};
