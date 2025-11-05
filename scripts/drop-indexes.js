// scripts/drop-indexes.js
import "dotenv/config";
import mongoose from "mongoose";
import Product from "../models/Product.js";

const uri = process.env.MONGO_URI || process.env.MONGO_URL;

(async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to", mongoose.connection.name);

    // Drop all indexes on products collection (dev only)
    await Product.collection.dropIndexes();
    console.log("✅ Dropped indexes");

    // Optional: also clear docs to be safe
    await Product.deleteMany({});
    console.log("🧹 Cleared products");

  } catch (e) {
    console.error("Error:", e.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();
