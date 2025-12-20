// server.js
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import tshirtsRouter from "./routes/tshirts.js";
import productsRouter from "./routes/products.js";
import designSessionRouter from "./routes/designSessionRoutes.js";
import previewRoutes from "./routes/previewRoutes.js";

// force-load .env located next to this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

const app = express();

// security middleware
app.use(helmet());

// CORS - tighten origins in production
const allowedOrigins = (process.env.CORS_ORIGINS && process.env.CORS_ORIGINS.split(",")) || [];
if (allowedOrigins.length) {
  app.use(cors({ origin: allowedOrigins }));
} else {
  app.use(cors()); // open in dev
}

// request limits & parsing
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: process.env.RATE_LIMIT_MAX ? Number(process.env.RATE_LIMIT_MAX) : 60,
});
app.use(limiter);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

if (!MONGO_URI) {
  console.error("⚠️ No MONGO_URI found in .env — aborting.");
  process.exit(1);
}

// Mongoose options & debug
mongoose.set("bufferCommands", false);
if (process.env.NODE_ENV !== "production") {
  mongoose.set("debug", function (coll, method, query) {
    console.log(`Mongoose ${coll}.${method}()`, JSON.stringify(query).slice(0, 200));
  });
}

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err && err.stack ? err.stack : err);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err && err.stack ? err.stack : err);
});

async function start() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });
    console.log("✅ MongoDB connected:", mongoose.connection.name || "(unknown)");

    // health endpoint
    app.get("/api/health", (req, res) =>
      res.json({
        status: "ok",
        message: "Server and database are live 🚀",
        mongo: mongoose.connection.readyState === 1 ? "connected" : "not connected",
      })
    );

    // register routes - mount design routes with a specific base path to avoid collisions
    app.use("/api/products", productsRouter);
    app.use("/api/design", designSessionRouter);   // changed to /api/design to avoid accidental overlaps
    app.use("/api/preview", previewRoutes);
    app.use("/api/tshirts", tshirtsRouter);

    // generic 404 handler for API
   // generic 404 for API routes — safe and version-proof
app.use((req, res, next) => {
  if (req.path && req.path.startsWith("/api/")) {
    return res.status(404).json({ ok: false, error: "API route not found" });
  }
  // if not an API path, pass to other handlers (or final 404)
  next();
});

    // simple error handler
    // note: keep this after all app.use() and routes
    // eslint-disable-next-line no-unused-vars
    app.use((err, req, res, next) => {
      console.error("Server error:", err && err.stack ? err.stack : err);
      res.status(err.status || 500).json({ ok: false, error: err.message || "Internal server error" });
    });

    // start server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    // graceful shutdown
    const shutdown = async () => {
      console.log("Shutting down gracefully...");
      server.close(() => console.log("HTTP server closed."));
      try {
        await mongoose.disconnect();
        console.log("Mongo disconnected.");
      } catch (e) {
        console.warn("Error disconnecting Mongo:", e);
      }
      process.exit(0);
    };
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (err) {
    console.error("❌ Startup error:", err && err.message ? err.message : err);
    process.exit(1);
  }
}

start();
