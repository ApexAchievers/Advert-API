import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../Models/User_Mod.js";
import { sendOtpEmail } from "../Utils/Mailer.js";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "5m" });
};

// === SIGNUP ===
export const signup = async (req, res) => {
  const { username, email, password, role } = req.body;
  const photo = req.file ? req.file.path : "";

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // expires in 5 mins

    // Send OTP to user's email
    await sendOtpEmail(email, otp);

    // Create user with OTP and not verified
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      photo,
      otp,
      otpExpires,
      verified: false,
    });

    res.status(201).json({
      message: "Signup successful. OTP sent to email.",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        photo: user.photo,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

// === LOGIN ===
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.verified) {
      return res.status(403).json({ message: "Please verify your email before logging in" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      photo: user.photo,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// === GET CURRENT USER ===
export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};

// === VERIFY OTP ===
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.verified) return res.status(400).json({ message: "User already verified" });

    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Mark user as verified
    user.verified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    // Generate JWT token now
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });

    res.status(200).json({
      message: "OTP verified successfully",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        photo: user.photo,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "OTP verification failed", error: err.message });
  }
};

// === RESEND OTP ===
export const resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.verified) return res.status(400).json({ message: "User is already verified" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    await sendOtpEmail(email, otp);

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    res.status(200).json({ message: "OTP resent to your email." });
  } catch (err) {
    res.status(500).json({ message: "Failed to resend OTP", error: err.message });
  }
};
