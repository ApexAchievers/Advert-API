import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./Routes/Authenticate_Routes.js";
import advertRoutes from "./Routes/Advert_Route.js";
import paymentRoute from "./Routes/Payent_Route.js";
import categoryRoute from "./Routes/Category_Route.js";

dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', userRoutes)
app.use('/api/adverts', advertRoutes)
app.use('/api/payment', paymentRoute)
app.use('/api/categories', categoryRoute)
app.use('/api/users', userRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("DB connection failed:", err));
