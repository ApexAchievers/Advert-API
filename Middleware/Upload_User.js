import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../Configurator/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "user_photos",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 300, height: 300, crop: "limit" }],
  },
});

const uploadUser = multer({ storage });

export default uploadUser;
