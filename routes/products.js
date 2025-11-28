import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// List: optionally filter by group
router.get("/", async (req, res) => {
  const { group } = req.query;
  const q = group ? { group } : {};
  const items = await Product.find(q);
  res.json(items);
});

// Create product
router.post("/", async (req, res) => {
  try {
    const data = { ...req.body };

    if (!data.slug && data.title) {
      data.slug = data.title
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-]/g, "");
    }
    if (data.slug) {
      data.slug = data.slug.toString().toLowerCase();
    }

    const product = new Product(data);
    await product.save();

    res.status(201).json(product);
  } catch (err) {
    console.error("❌ Error creating product:", err);
    res.status(400).json({
      message: "Failed to create product",
      error: err.message
    });
  }
});

// Detail by slug
router.get("/:slug", async (req, res) => {
  const slug = String(req.params.slug || "").toLowerCase();
  console.log("🔎 Looking for slug:", slug);
  const item = await Product.findOne({ slug });
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});

// Get product by ID (for debugging)
router.get("/by-id/:id", async (req, res) => {
  try {
    const item = await Product.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (err) {
    console.error("❌ Error fetching by ID:", err);
    res.status(400).json({ error: "Invalid ID" });
  }
});

// Delete product by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully", deleted });
  } catch (err) {
    console.error("❌ Error deleting product:", err);
    res.status(400).json({ error: "Invalid ID" });
  }
});

// OPTIONAL: Delete product by slug
router.delete("/slug/:slug", async (req, res) => {
  try {
    const slug = String(req.params.slug || "").toLowerCase();
    const deleted = await Product.findOneAndDelete({ slug });
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully", deleted });
  } catch (err) {
    console.error("❌ Error deleting product by slug:", err);
    res.status(400).json({ error: "Delete failed" });
  }
});

export default router;
