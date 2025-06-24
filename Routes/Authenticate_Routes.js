import express from "express";
import { signup, login, getMe, verifyOtp, resendOtp, updateProfile, addToFavorites, getFavorites, removeFromFavorites, resetPassword, forgotPassword } from "../Controllers/User_Con.js";
import uploadUser from "../Middleware/Upload_User.js";
import protect from "../Middleware/Auth.js";
import validate from "../Middleware/Validate.js";
import { signUpSchema, loginSchema } from "../Validations/User_Validation.js";


const userRoutes = express.Router();

userRoutes.post("/signup", uploadUser.single("photo"), validate(signUpSchema), signup);
userRoutes.post("/login", validate(loginSchema), login);
userRoutes.get("/me", protect, getMe);
userRoutes.post("/verify-otp", verifyOtp);
userRoutes.post("/resend-otp", resendOtp);
userRoutes.put('/update', protect, uploadUser.single("photo"), updateProfile);
userRoutes.post("/favorites/:advertId", protect, addToFavorites);
userRoutes.delete("/favorites/:advertId", protect, removeFromFavorites);
userRoutes.get("/favorites", protect, getFavorites);
userRoutes.post("/reset-password/:token", resetPassword);
userRoutes.post("/forgot-password", forgotPassword)

export default userRoutes
