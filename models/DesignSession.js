import mongoose from "mongoose";

const DesignSessionSchema = new mongoose.Schema(
  {
    templateId: { type: String, required: true },
    paletteId:  { type: String, required: true },

    data:           { type: Object, default: {} },
    runtimeEls:     { type: Array,  default: [] },
    deletedKeys:    { type: [String], default: [] },

    posOverrides:   { type: Object, default: {} },
    styleOverrides: { type: Object, default: {} },
    shapeOverrides: { type: Object, default: {} },

    bakedFrontEls:  { type: Array, default: [] },
    bakedBackEls:   { type: Array, default: [] },

    // NEW: separate screenshots for each side
    previewFrontPng: { type: String, default: "" },
    previewBackPng:  { type: String, default: "" },

    // LEGACY: keep this so old sessions don't break
    previewPng:      { type: String, default: "" },
  },
  { timestamps: true }
);

const DesignSession = mongoose.model(
  "DesignSession",
  DesignSessionSchema
);

export default DesignSession;
