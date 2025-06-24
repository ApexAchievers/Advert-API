import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "vendor"],
      default: "user",
    },
    photo: {
      type: String,
      default: "",
    },
    companyName:
         { type: String },
    businessAddress: {
       type: String
       },
    favorites: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Advert",
  },
],
    paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
    },

    paymentReference: {
      type: String,
      default: null,
    },
    otp: {
      type: String,
    },
    
    otpExpires: {
      type: Date,
    },
    verified: {
      type: Boolean,
      default: false,
    },

    resetPasswordToken: {
  type: String,
},
resetPasswordExpires: {
  type: Date,
},

  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
