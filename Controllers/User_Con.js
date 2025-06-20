import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../Models/User_Mod.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "5m" });
};

export const signup = async (req, res) => {
  const { username, email, password, role } = req.body;
  const photo = req.file ? req.file.path : "";

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      photo,
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      photo: user.photo,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

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

export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};
