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
  enum: ["Nissan", "Honda", "Mitsubishi", "Mazda", "Suzuki", "Subaru", "Isuzu", "Hyundai", "Kia", "Daewoo", "Benz", "BMW", "VW", "Audi", "Opel", "Ford", "Chevrolet", "Chrysler", "Cadillac", "GMC", "Dodge", "Peugeot", "Renault", "Citroen", "Land Rover", "Range Rover", "MG", "Jaguar", "Mini", "Changan", "Geely", "JAC", "Mahindra", "Lexus", "Infiniti", "Hummer", "Porsche", "Tesla"],
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
    type: String,
    enum: ["Camry", "Corolla", "Yaris/Vitz", "Rav4", "Land Cruiser", "Prado", "Avensis", "Highlander", "Matrix", "Fortuner", "Altima", "Agyo", "Sentra", "Rogue", "Pathfinder", "Patrol", "X-trail", "Versa", "Hardbody", "Frontier", "Civic", "Accord", "CR-V", "Passport", "Pilot", "City", "Insight", "Fit", "L200", "Pajero", "Outlander", "Galant", "ASX", "Eclipse Cross", "Mazda 3", "Mazda 6", "CX-5", "CX-9", "Bongo", "BT-50", "Alto", "Swift", "Vitara", "Jimny", "Celerio", "Forester", "Legacy", "Impreza", "Outback", "Crosstrek", "Elantra", "Accent", "i10", "i20", "i30", "ix35/Tucson", "Sonata", "Creta", "Santa Fe", "Palisade", "Picanto", "Cerato", "Rio", "sportage", "Sorento", "Optima", "Carens", "Morning", "Odyssey", "Serena", "Sierra", "E-Class", "S-Class", "GLE", "ML", "GLS", "C-Class", "Sprinter", "E46", "E90", "F30", "E60", "F10", "X3", "X5", "X6", "X7", "7series", "Golf", "Passat", "Polo", "Jetta", "Tiguan", "Toureg", "A4", "A6", "Q5", "q7", "A3", "RS4", "RS7", "Edge", "Explorer", "F-150", "F-350", "Focus", "Fusion", "Ranger", "Cruze", "Aveo", "Equinox", "Spark", "Malibu", "Silverado", "Camaro", "Colorado", "Yukon", "CTS", "206", "207", "301", "307", "508", "Logan", "Koleos", "Duster", "Sandero", "Kangoo", "Evoque", "Defender", "Velar", "Voque", "Freelander", "HSE", "Sports", "MG3", "MG ZS", "Alsvin", "CS35", "CS75", "Emgrand", "Coolray", "Vision", "Scorpio", "Bolero", "S2", "T6 pickup", "Model S", "Model 3", "Model Xr", "Model Y", "Astra", "Corsa", "Vectra", "Chrysler 300 / 300C", "Sebring", "Omega"],
    required: true,
  }
    
  },
  { timestamps: true }
);

// Add indexes for faster querying and filtering
advertSchema.index({ Model: 1 });
advertSchema.index({ category: 1 });
advertSchema.index({ item: 1 });
advertSchema.index({ condition: 1 });

export const Advert = mongoose.model("Advert", advertSchema);
