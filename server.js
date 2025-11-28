// server.js (replace file with this)
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import tshirtsRouter from "./routes/tshirts.js";
import productsRouter from "./routes/products.js";
import designSessionRouter from "./routes/designSessionRoutes.js";

// force-load .env located next to this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

console.log("Loaded .env from:", path.join(__dirname, ".env"));
console.log("MONGO_URI preview:", (process.env.MONGO_URI || "").slice(0, 120));

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

if (!MONGO_URI) {
  console.error("⚠️ No MONGO_URI found in .env — aborting.");
  process.exit(1);
}

// Fail fast instead of buffering queries while disconnected
mongoose.set("bufferCommands", false);

// TEMPORARY DEBUG: show mongoose ops + stacktrace to find where failing queries originate
mongoose.set("debug", function (coll, method, query) {
  console.log(`Mongoose ${coll}.${method}()`, JSON.stringify(query).slice(0, 200));
  console.trace("Origin of mongoose operation (temporary trace)");
});

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

    // routes after DB connected
    app.get("/api/health", (req, res) =>
      res.json({
        status: "ok",
        message: "Server and database are live 🚀",
        mongo: mongoose.connection.readyState === 1 ? "connected" : "not connected",
      })
    );

    app.use("/api/products", productsRouter);
    app.use("/api", designSessionRouter);
    app.use("/api/tshirts", tshirtsRouter);
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection error:", err && err.message ? err.message : err);
    process.exit(1);
  }
}

start();
