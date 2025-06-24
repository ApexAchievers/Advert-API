import axios from "axios";
import { User } from "../Models/User_Mod.js";

export const initiateVendorPayment = async (req, res) => {
  const { email, fullname } = req.body;

  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: 5000 * 100, // GHS 50.00 in pesewas
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
    res.status(500).json({ message: "Paystack error", error: err.message });
  }
};

export const verifyPayment = async (req, res) => {
  const { reference } = req.params;

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = response.data.data;

    if (data.status === "success") {
      // Update user by email or metadata (e.g. fullname)
      const email = data.customer.email;

      const user = await User.findOneAndUpdate(
        { email },
        {
          paymentStatus: "paid",
          paymentReference: reference,
        },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "User not found to update" });
      }

      return res.status(200).json({
        message: "Payment verified and user updated",
        user,
      });
    } else {
      return res.status(400).json({ message: "Payment verification failed" });
    }
  } catch (err) {
    res.status(500).json({
      message: "Error verifying payment",
      error: err.response?.data || err.message,
    });
  }
};
