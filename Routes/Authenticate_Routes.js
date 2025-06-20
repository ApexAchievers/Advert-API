import express from "express";
import { signup, login, getMe } from "../Controllers/User_Con.js";
import upload from "../Middleware/Upload.js";
import protect from "../Middleware/Auth.js";
import validate from "../Middleware/Validate.js";
import { signUpSchema, loginSchema } from "../Validations/User_Validation.js";

const userRoutes = express.Router();

userRoutes.post("/signup", upload.single("photo"), validate(signUpSchema), signup);
userRoutes.post("/login", validate(loginSchema), login);
userRoutes.get("/me", protect, getMe);

export default userRoutes;
