// models/Tshirt.js
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
  type: String,
  label: String,
  required: Boolean,
}, { _id: false });

const TemplateSchema = new mongoose.Schema({
  templateId: { type: String, required: true },
  name: String,
  description: String,
  thumbnail: FileRefSchema,
  mockups: [FileRefSchema],
  sourceFiles: [FileRefSchema],
  priceModifier: Number,
  tags: [String],
  palettes: [{ id: String, bg: String, primary: String, accent: String, accent2: String }],
  customizableFields: [CustomFieldSchema],
  isActive: { type: Boolean, default: true }
}, { _id: false });

const CustomizationAreaSchema = new mongoose.Schema({
  id: String,
  label: String,
  position: {
    x: Number,
    y: Number,
    width: Number,
    height: Number
  },
  allowedTypes: [String],
  required: Boolean
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

const TshirtSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: String,
  badge: String,
  priceText: String,
  image: String,
  rating: Number,
  group: { type: String, enum: ["tshirt", "shape", "paper", "specialty"], default: "tshirt" },
  slug: { type: String, unique: true },

  gallery: [{ src: String, alt: String }],

  // tshirt fields
  colors: [{ id: String, label: String, hex: String, swatchImage: FileRefSchema }],
  sizes: [{ size: String, code: String, inStock: Boolean, extraPrice: Number }],

  mockups: [{
    id: String,
    label: String,
    file: FileRefSchema,
    previewUrl: String,
    baseColorOverride: String
  }],

  customizationAreas: [CustomizationAreaSchema],

  highlights: [String],
  badges: [String],
  basePriceNote: String,
  shippingBanner: { labelHtml: String },
  deliveryOptions: [{ value: String, label: String }],
  quantities: [{ qty: Number, price: Number, unit: Number, tag: String, savings: String }],
  overviewSections: [OverviewSectionSchema],
  ctas: {
    browseDesignsHref: String,
    uploadDesignHref: String,
  },
  reviews: [{ name: String, rating: Number, body: String, date: String }],
  templates: [TemplateSchema],

}, { timestamps: true });

export default mongoose.model("Tshirt", TshirtSchema);
