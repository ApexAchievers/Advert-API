import express from "express";
import { signup, login, getMe, verifyOtp, resendOtp, updateProfile } from "../Controllers/User_Con.js";
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
export default userRoutes
