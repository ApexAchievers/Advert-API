import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../Models/User_Mod.js";
import { sendOtpEmail } from "../Utils/Mailer.js";

// === JWT TOKEN GENERATOR ===
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// === SIGNUP ===
export const signup = async (req, res) => {
  const {
    fullname,
    email,
    password,
    confirmPassword,
    role,
    companyName,
    businessAddress,
  } = req.body;

  const photo = req.file ? req.file.path : "";

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    await sendOtpEmail(email, otp);

    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
      role,
      photo,
      otp,
      otpExpires,
      verified: false,
      ...(role === "vendor" && {
        companyName,
        businessAddress,
        paymentStatus: "pending",
        paymentReference: null,
      }),
    });

    res.status(201).json({
      message: "Signup successful. OTP sent to email.",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        photo: user.photo,
        ...(role === "vendor" && {
          companyName: user.companyName,
          businessAddress: user.businessAddress,
          paymentStatus: user.paymentStatus,
        }),
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

// === LOGIN ===
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    if (!user.verified) return res.status(403).json({ message: "Please verify your email before logging in" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        photo: user.photo,
        ...(user.role === "vendor" && {
          companyName: user.companyName,
          businessAddress: user.businessAddress,
          paymentStatus: user.paymentStatus,
        }),
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// === GET CURRENT USER ===
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to get user", error: err.message });
  }
};

// === VERIFY OTP ===
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.verified) return res.status(400).json({ message: "User already verified" });
    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (user.otpExpires < Date.now()) return res.status(400).json({ message: "OTP has expired" });

    user.verified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({
      message: "OTP verified successfully",
      token: generateToken(user._id),
      user: {
        _id: user._id,
        fullname: user.fullname,
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
    if (user.verified) return res.status(400).json({ message: "User already verified" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    await sendOtpEmail(email, otp);

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    res.status(200).json({ message: "OTP resent to your email." });
  } catch (err) {
    res.status(500).json({ message: "Failed to resend OTP", error: err.message });
  }
};

// === UPDATE PROFILE ===
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { fullname, email, companyName, businessAddress } = req.body;

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;

    if (user.role === "vendor") {
      if (companyName) user.companyName = companyName;
      if (businessAddress) user.businessAddress = businessAddress;
    }

    if (req.file) {
      user.photo = req.file.path;
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        photo: user.photo,
        companyName: user.companyName,
        businessAddress: user.businessAddress,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
};

// === FAVOURITES ===
export const addToFavorites = async (req, res) => {
  const userId = req.user._id;
  const advertId = req.params.advertId;

  try {
    const user = await User.findById(userId);
    if (user.favorites.includes(advertId)) {
      return res.status(400).json({ message: "Already in favorites" });
    }

    user.favorites.push(advertId);
    await user.save();

    res.json({ message: "Added to favorites", favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: "Failed to add to favorites", error: err.message });
  }
};

export const removeFromFavorites = async (req, res) => {
  const userId = req.user._id;
  const advertId = req.params.advertId;

  try {
    const user = await User.findById(userId);
    user.favorites = user.favorites.filter(
      (favId) => favId.toString() !== advertId
    );
    await user.save();

    res.json({ message: "Removed from favorites", favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove from favorites", error: err.message });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");
    res.json({ favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: "Failed to get favorites", error: err.message });
  }
};

// === FORGOT PASSWORD ===
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHashed = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = resetTokenHashed;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await sendOtpEmail(email, "Reset your password using this link: " + resetURL);

    res.status(200).json({ message: "Reset link sent to email." });
  } catch (err) {
    res.status(500).json({ message: "Failed to send reset link", error: err.message });
  }
};

// === RESET PASSWORD ===
export const resetPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  const resetToken = req.params.token;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Password reset failed", error: err.message });
  }
};
