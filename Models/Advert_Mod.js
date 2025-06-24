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
    Make: {
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
        "Engine & Mechanical Components",
        "Transmission & Drivetrain",
        "Suspension & Steering",
        "Braking System",
        "Electrical & Battery System",
        "Lights & Indicators",
        "Climate & Comfort",
        "Body & Exterior",
        "Interior Components",
        "Cycling essentials (bicycle components)",
        "Services",
        "Fluid and lubricants",
        "Bike parts and accessories"
      ],
      required: true,
    },
    item: {
      type: String,
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
     Model: {
      type: [],
    },
    
  },
  { timestamps: true }
);

// Add indexes for faster querying and filtering
advertSchema.index({ brand: 1 });
advertSchema.index({ category: 1 });
advertSchema.index({ item: 1 });
advertSchema.index({ condition: 1 });

export const Advert = mongoose.model("Advert", advertSchema);
