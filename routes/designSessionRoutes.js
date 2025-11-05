import express from "express";
import DesignSession from "../models/DesignSession.js";

const router = express.Router();

/**
 * POST /api/design-session
 * Create a new design session (first time save)
 */
router.post("/design-session", async (req, res) => {
  try {
    const session = await DesignSession.create(req.body);

    return res.json({
      ok: true,
      id: session._id,
    });
  } catch (err) {
    console.error("❌ Failed to save design:", err);
    return res
      .status(500)
      .json({ ok: false, error: "Failed to save design" });
  }
});

/**
 * PUT /api/design-session/:id
 * Update an existing design session (subsequent saves / Next button)
 */
router.put("/design-session/:id", async (req, res) => {
  try {
    const updated = await DesignSession.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // return updated doc
    );

    if (!updated) {
      return res
        .status(404)
        .json({ ok: false, error: "Session not found" });
    }

    return res.json({
      ok: true,
      id: updated._id,
    });
  } catch (err) {
    console.error("❌ Failed to update design session:", err);
    return res
      .status(500)
      .json({ ok: false, error: "Failed to update design" });
  }
});

/**
 * GET /api/design-session/:id
 * Load one saved design session by ID (ReviewPage.jsx uses this)
 */
router.get("/design-session/:id", async (req, res) => {
  try {
    const session = await DesignSession.findById(req.params.id);

    if (!session) {
      return res
        .status(404)
        .json({ ok: false, error: "Design session not found" });
    }

    return res.json({ ok: true, session });
  } catch (err) {
    console.error("❌ Failed to load design:", err);
    return res
      .status(500)
      .json({ ok: false, error: "Failed to load design" });
  }
});

/**
 * GET /api/design-session
 * List recent sessions (debug / admin)
 */
router.get("/design-session", async (req, res) => {
  try {
    const sessions = await DesignSession.find()
      .sort({ createdAt: -1 })
      .limit(50);

    return res.json({ ok: true, sessions });
  } catch (err) {
    console.error("❌ Failed to list design sessions:", err);
    return res
      .status(500)
      .json({ ok: false, error: "Failed to list designs" });
  }
});

/**
 * DELETE /api/design-session/:id
 * Delete one saved design session permanently
 */
router.delete("/design-session/:id", async (req, res) => {
  try {
    const deleted = await DesignSession.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res
        .status(404)
        .json({ ok: false, error: "Design session not found" });
    }

    return res.json({
      ok: true,
      deleted: deleted._id,
      message: "Design session deleted",
    });
  } catch (err) {
    console.error("❌ Failed to delete design:", err);
    return res
      .status(500)
      .json({ ok: false, error: "Failed to delete design" });
  }
});

/**
 * DELETE /api/design-session
 * Delete all saved design sessions (admin / debug only)
 */
router.delete("/design-session", async (req, res) => {
  try {
    const result = await DesignSession.deleteMany({}); // deletes every document

    return res.json({
      ok: true,
      deletedCount: result.deletedCount,
      message: `Deleted ${result.deletedCount} design sessions`,
    });
  } catch (err) {
    console.error("❌ Failed to delete all design sessions:", err);
    return res
      .status(500)
      .json({ ok: false, error: "Failed to delete all design sessions" });
  }
});

export default router;
