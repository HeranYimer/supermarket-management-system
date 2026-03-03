import * as CategoryModel from "../../models/category.model.js";

// GET ALL
export const getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.getCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// CREATE
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    await CategoryModel.createCategory(name);
    res.json({ message: "Category created" });
  } catch (err) {
    res.status(500).json({ error: "Failed to create category" });
  }
};

// UPDATE (ADMIN + MANAGER ONLY)
export const updateCategory = async (req, res) => {
  try {
    // ✅ ROLE CHECK ADDED
    if (!["ADMIN", "MANAGER"].includes(req.user.role)) {
      return res.status(403).json({ error: "Not authorized to update category" });
    }

    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    await CategoryModel.updateCategory(Number(id), name);
    res.json({ message: "Category updated" });
  } catch (err) {
    console.error("Update category error:", err);
    res.status(500).json({ error: err.message || "Failed to update category" });
  }
};

// DELETE (ADMIN ONLY)
export const deleteCategory = async (req, res) => {
  try {
    // ✅ ROLE CHECK ADDED
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Not authorized to delete category" });
    }

    const { id } = req.params;
    await CategoryModel.deleteCategory(id);

    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete category" });
  }
};