// print-api/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import productsRouter from "./routes/products.js";
import designSessionRouter from "./routes/designSessionRoutes.js";

dotenv.config();

const app = express();

// ---------- Middleware ----------
app.use(cors());
// allow JSON bodies up to ~10mb so we can store blobs / long data
app.use(express.json({ limit: "10mb" }));

// ---------- MongoDB Connection ----------
const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL;
const PORT = process.env.PORT || 5000;

if (!MONGO_URI) {
  console.warn(
    "⚠️  No MONGO_URI / MONGO_URL found in .env.\n" +
      "Example:\n" +
      "MONGO_URI=mongodb://127.0.0.1:27017/printdesigner"
  );
}

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    console.log("📦 DB:", mongoose.connection.name);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

// ---------- Health Check ----------
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Server and database are live 🚀",
    mongo:
      mongoose.connection.readyState === 1
        ? "connected"
        : "not connected",
  });
});

// ---------- Routes ----------
// Product APIs
app.use("/api/products", productsRouter);

// Design session APIs
// POST   /api/design-session
// GET    /api/design-session/:id
// GET    /api/design-session
app.use("/api", designSessionRouter);

// ---------- Start Server ----------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
