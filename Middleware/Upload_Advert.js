import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../Configurator/cloudinary.js";

const advertStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "advert_photos",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const uploadAdvert = multer({ storage: advertStorage });

export default uploadAdvert;
