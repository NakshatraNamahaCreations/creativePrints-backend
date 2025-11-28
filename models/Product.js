// models/Product.js
import mongoose from "mongoose";

const FileRefSchema = new mongoose.Schema({
  url: String,
  filename: String,
  mimeType: String,
  width: Number,
  height: Number
}, { _id: false });

const CustomFieldSchema = new mongoose.Schema({
  key: String,
  type: String,       // "text" | "image" | "select" | etc.
  label: String,
  required: Boolean,
}, { _id: false });

const TemplateSchema = new mongoose.Schema({
  templateId: { type: String, required: true }, // e.g. "vp_ribbon" (maps to client template)
  name: String,
  description: String,
  thumbnail: FileRefSchema,       // permanent thumbnail URL
  mockups: [FileRefSchema],
  sourceFiles: [FileRefSchema],
  priceModifier: Number,
  tags: [String],
  palettes: [{ id: String, bg: String, primary: String, accent: String, accent2: String }],
  customizableFields: [CustomFieldSchema],
  isActive: { type: Boolean, default: true }
}, { _id: false });

const MediaSchema = new mongoose.Schema({
  type: { type: String },
  src: String,
  alt: String,
}, { _id: false });

const OverviewSectionSchema = new mongoose.Schema({
  title: String,
  bodyHtml: String,
  media: MediaSchema,
  mediaPosition: String,
}, { _id: false });

const ProductSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  badge: String,
  priceText: String,
  image: String,
  rating: Number,
  group: { type: String, enum: ["shape", "paper", "specialty"] },
  slug: { type: String, unique: true },

  gallery: [{ src: String, alt: String }],

  highlights: [String],
  badges: [String],
  basePriceNote: String,
  shippingBanner: { labelHtml: String },
  deliveryOptions: [{ value: String, label: String }],
  cornerOptions: [{ value: String, label: String }],
  quantities: [{ qty: Number, price: Number, unit: Number, tag: String, savings: String }],
  overviewSections: [OverviewSectionSchema],
  ctas: {
    browseDesignsHref: String,
    uploadDesignHref: String,
  },
  reviews: [{ name: String, rating: Number, body: String, date: String }],

  // NEW: templates attached to this product
  templates: [TemplateSchema],
}, { timestamps: true });

export default mongoose.model("Product", ProductSchema);
