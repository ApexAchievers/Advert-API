import mongoose from "mongoose";

const advertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      enum: [
        "Toyota",
        "Honda",
        "Nissan",
        "Hyundai",
        "Kia",
        "BMW",
        "Mercedes-Benz",
        "Ford",
        "Chevrolet",
        "Volkswagen",
        "Mazda",
        "Other"
      ],
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Engine",
        "Transmission",
        "Brakes",
        "Electrical",
        "Suspension",
        "Body",
        "Interior",
        "Tires",
        "Other"
      ],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    condition: {
      type: String,
      enum: ["New", "Used"],
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String, // Cloudinary URLs
      }
    ],
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    partNumber: {
      type: String,
    },
    vehicleCompatibility: {
      type: [String],
    },
  },
  { timestamps: true }
);

// Add indexes for faster querying and filtering
advertSchema.index({ brand: 1 });
advertSchema.index({ category: 1 });
advertSchema.index({ condition: 1 });

export const Advert = mongoose.model("Advert", advertSchema);
