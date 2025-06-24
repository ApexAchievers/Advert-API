
import { categoryItems } from "../Utils/Category_Item.js";

export const getCategoryItems = (req, res) => {
  const category = req.params.category;

  if (!categoryItems[category]) {
    return res.status(404).json({ message: "Category not found" });
  }

  res.json({ items: categoryItems[category] });
};

export const getAllCategories = (req, res) => {
  res.json({ categories: Object.keys(categoryItems) });
};
