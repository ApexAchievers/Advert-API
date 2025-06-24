import express from "express";
import { getAllCategories, getCategoryItems } from "../Controllers/Category_Con.js";
const categoryRoute = express.Router();

categoryRoute.get("/", getAllCategories);
categoryRoute.get("/:category/items", getCategoryItems);

export default categoryRoute;
