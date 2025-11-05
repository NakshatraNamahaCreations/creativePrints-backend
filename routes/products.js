import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// List: optionally filter by group
router.get("/", async (req, res) => {
  const { group } = req.query;                // ✅ use correct field
  const q = group ? { group } : {};
  const items = await Product.find(q);
  res.json(items);
});

// Detail by slug
router.get("/:slug", async (req, res) => {
  const slug = String(req.params.slug || "").toLowerCase();
  console.log("🔎 Looking for slug:", slug);
  const item = await Product.findOne({ slug });
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});

export default router;
