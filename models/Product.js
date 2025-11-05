import mongoose from "mongoose";

const MediaSchema = new mongoose.Schema(
  {
    type: { type: String },   // literal field named "type"
    src: String,
    alt: String,
  },
  { _id: false }
);

const OverviewSectionSchema = new mongoose.Schema(
  {
    title: String,
    bodyHtml: String,
    media: MediaSchema,
    mediaPosition: String,
  },
  { _id: false }
);

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
  quantities: [
    { qty: Number, price: Number, unit: Number, tag: String, savings: String },
  ],
  overviewSections: [OverviewSectionSchema],
  ctas: {
    browseDesignsHref: String,
    uploadDesignHref: String,
  },
  reviews: [{ name: String, rating: Number, body: String, date: String }],
});

export default mongoose.model("Product", ProductSchema);
