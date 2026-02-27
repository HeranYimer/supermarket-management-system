import * as ProductModel from "../../models/product.model.js";
import { getImageForProduct } from "../../utils/unsplash.js";

export const createProduct = async (req, res) => {
  try {
    const image_url = await getImageForProduct(req.body.name) || "https://via.placeholder.com/150";

    const productData = {
      ...req.body,
      image_url,
    };

    const id = await ProductModel.createProduct(productData);
    res.status(201).json({ message: "Product created", id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create product" });
  }
};

export const getProducts = async (req, res) => {
  try {
    const status = req.query.status || "all"; // active | inactive | all
    const products = await ProductModel.getAllProducts(status);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await ProductModel.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

export const getInactiveProducts = async (req, res) => {
  try {
    const products = await ProductModel.getInactiveProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch inactive products" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    await ProductModel.updateProduct(req.params.id, req.body);
    res.json({ message: "Product updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
};

export const hardDeleteProduct = async (req, res) => {
  try {
    await ProductModel.hardDeleteProduct(req.params.id);
    res.json({ message: "Product permanently deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};
export const softDeleteProduct = async (req, res) => {
  try {
    await ProductModel.softDeleteProduct(req.params.id);
    res.json({ message: "Product deactivated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to deactivate product" });
  }
};
export const restoreProduct = async (req, res) => {
  try {
    await ProductModel.restoreProduct(req.params.id);
    res.json({ message: "Product restored successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to restore product" });
  }
};