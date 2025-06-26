import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./Routes/Authenticate_Routes.js";
import advertRoutes from "./Routes/Advert_Route.js";
import paymentRoute from "./Routes/Payent_Route.js";
import categoryRoute from "./Routes/Category_Route.js";
import { handlePaystackWebhook } from "./Controllers/Payment_Con.js"; // Import this directly

dotenv.config();

const app = express();
app.use(cors());

// === Step 1: Define webhook route BEFORE express.json() ===
app.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }), // Important for Paystack signature verification
  handlePaystackWebhook
);

// === Step 2: Apply JSON and URL-encoded middleware AFTER webhook ===
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === Step 3: Register all other routes ===
app.use('/api/auth', userRoutes);
app.use('/api/adverts', advertRoutes);
app.use('/api/payment', paymentRoute); // This should not include /webhook anymore
app.use('/api/categories', categoryRoute);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("DB connection failed:", err));
