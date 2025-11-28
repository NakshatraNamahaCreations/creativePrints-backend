// routes/tshirts.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Tshirt from "../models/Tshirt.js";

const router = express.Router();

// ---------- multer (local storage for dev) ----------
const UPLOAD_DIR = path.join(process.cwd(), "uploads", "tshirts");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`;
    cb(null, name);
  }
});
const upload = multer({ storage, limits: { fileSize: 12 * 1024 * 1024 } });

// Helper to build a FileRef
const buildFileRef = (reqFile, req) => {
  return {
    url: `${req.protocol}://${req.get("host")}/uploads/tshirts/${reqFile.filename}`,
    filename: reqFile.filename,
    mimeType: reqFile.mimetype,
    width: null,
    height: null
  };
};

// ---------- Public routes ----------

// List tshirts (optional filters)
router.get("/", async (req, res) => {
  try {
    const { q, color, size } = req.query;
    const filter = {};
    if (q) filter.title = { $regex: q, $options: "i" };
    if (color) filter["colors.id"] = color;
    if (size) filter["sizes.code"] = size;

    const items = await Tshirt.find(filter).lean().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error("GET /api/tshirts error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Detail by slug
router.get("/:slug", async (req, res) => {
  try {
    const slug = String(req.params.slug || "").toLowerCase();
    const item = await Tshirt.findOne({ slug }).lean();
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (err) {
    console.error("GET /api/tshirts/:slug error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------- Admin / write routes ----------
// NOTE: add authentication middleware in production

// Create new tshirt
router.post("/", async (req, res) => {
  try {
    const body = req.body;
    if (!body.title || !body.slug) return res.status(400).json({ error: "title and slug required" });
    const existing = await Tshirt.findOne({ slug: body.slug });
    if (existing) return res.status(409).json({ error: "slug already exists" });

    const created = await Tshirt.create(body);
    res.status(201).json(created);
  } catch (err) {
    console.error("POST /api/tshirts error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// Update product
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const update = req.body;
    const updated = await Tshirt.findByIdAndUpdate(id, update, { new: true });
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    console.error("PUT /api/tshirts/:id error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete product
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Tshirt.findByIdAndDelete(id);
    res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/tshirts/:id error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// Accepts field 'file' (multipart/form-data)
router.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const fileRef = buildFileRef(req.file, req);
    res.json(fileRef);
  } catch (err) {
    console.error("POST /api/tshirts/upload error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Upload a mockup and attach to a tshirt (useful to add new mockup images to product)
// Form fields: file (image), label (string), previewUrl (optional)
router.post("/:id/mockups", upload.single("file"), async (req, res) => {
  try {
    const id = req.params.id;
    const label = req.body.label || "Mockup";
    const previewUrl = req.body.previewUrl || null;

    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const fileRef = buildFileRef(req.file, req);
    const mockup = {
      id: `mockup-${Date.now()}`,
      label,
      file: fileRef,
      previewUrl
    };

    const updated = await Tshirt.findByIdAndUpdate(id, { $push: { mockups: mockup } }, { new: true });
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json({ mockup, product: updated });
  } catch (err) {
    console.error("POST /api/tshirts/:id/mockups error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
