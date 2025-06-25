import express from "express";
import {createAdvert, getAllAdverts, getAdvertById, updateAdvert, deleteAdvert, getVendorAdverts} from "../Controllers/Advert_Con.js";

import protect from "../Middleware/Auth.js";
import uploadAdvert from "../Middleware/Upload_Advert.js";

const advertRoutes = express.Router();

// Protected Routes (vendors only)
advertRoutes.post("/", protect, uploadAdvert.array("images", 5), createAdvert); // Create advert
advertRoutes.get("/my-adverts", protect, getVendorAdverts);
advertRoutes.put("/:id", protect, uploadAdvert.array("images", 5), updateAdvert); // Update advert
advertRoutes.delete("/:id", protect, deleteAdvert); // Delete advert
advertRoutes.get("/my-adverts", protect, getVendorAdverts);
// Public Routes
advertRoutes.get("/", getAllAdverts); // View all adverts
advertRoutes.get("/:id", getAdvertById); // View single advert




export default advertRoutes;
