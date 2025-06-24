import { Advert } from "../Models/Advert_Mod.js";
import { User } from "../Models/User_Mod.js";

// === CREATE ADVERT (Vendor only) ===
export const createAdvert = async (req, res) => {
  const {
    title,
    description,
    make,
    category,
    price,
    condition,
    location,
    model,
    partNumber,
  } = req.body;

  try {
    if (req.user.role !== "vendor") {
      return res.status(403).json({ message: "Only vendors can create adverts." });
    }

    if (req.user.paymentStatus !== "paid") {
      return res.status(403).json({ message: "Please complete payment before posting adverts." });
    }

    const imageUrls = req.files?.map(file => file.path) || [];

    const advert = await Advert.create({
      title: title?.trim(),
      description: description?.trim(),
      make: make?.trim(),
      category: category?.trim(),
      price: parseFloat(price),
      condition: condition?.trim(),
      location: location?.trim(),
      model: model?.split(",").map(v => v.trim()),
      partNumber: partNumber?.trim(),
      images: imageUrls,
      vendor: req.user._id,
    });

    res.status(201).json({ message: "Advert created", advert });
  } catch (err) {
    res.status(500).json({ message: "Advert creation failed", error: err.message });
  }
};


// === GET ALL ADVERTS (with filters + pagination) ===
export const getAllAdverts = async (req, res) => {
  const {
    title,
    Make,
    category,
    condition,
    minPrice,
    maxPrice,
    page = 1,
    limit = 10,
  } = req.query;

  const filter = {};

  if (title) filter.title = { $regex: title, $options: "i" };
  if (Make) filter.Make = Make;
  if (category) filter.category = category;
  if (condition) filter.condition = condition;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }

  try {
    const total = await Advert.countDocuments(filter);

    const adverts = await Advert.find(filter)
      .populate("vendor", "username email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalAdverts: total,
      adverts,
    });
  } catch (err) {
    res.status(500).json({ message: "Fetching adverts failed", error: err.message });
  }
};

// === GET SINGLE ADVERT BY ID ===
export const getAdvertById = async (req, res) => {
  try {
    const advert = await Advert.findById(req.params.id).populate("vendor", "username email");

    if (!advert) return res.status(404).json({ message: "Advert not found" });

    res.json(advert);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve advert", error: err.message });
  }
};

// === UPDATE ADVERT (Vendor only) ===
export const updateAdvert = async (req, res) => {
  try {
    const advert = await Advert.findById(req.params.id);

    if (!advert) return res.status(404).json({ message: "Advert not found" });

    if (advert.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to update this advert" });
    }

    const updates = req.body;
    if (req.files && req.files.length > 0) {
      updates.images = req.files.map(file => file.path);
    }

    const updated = await Advert.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    res.json({ message: "Advert updated", advert: updated });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

// === DELETE ADVERT (Vendor only) ===
export const deleteAdvert = async (req, res) => {
  try {
    const advert = await Advert.findById(req.params.id);

    if (!advert) return res.status(404).json({ message: "Advert not found" });

    if (advert.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this advert" });
    }

    await advert.deleteOne();

    res.json({ message: "Advert deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};

export const getVendorAdverts = async (req, res) => {
  try {
    if (req.user.role !== "vendor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const adverts = await Advert.find({ vendor: req.user._id }).sort({ createdAt: -1 });

    res.json({ count: adverts.length, adverts });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch vendor adverts", error: err.message });
  }
};




