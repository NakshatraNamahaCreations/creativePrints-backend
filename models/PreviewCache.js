// models/PreviewCache.js
import mongoose from "mongoose";

const PreviewCacheSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  data: {
    title: String,
    description: String,
    image: String,
    url: String,
  },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("PreviewCache", PreviewCacheSchema);
