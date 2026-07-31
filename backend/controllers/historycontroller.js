import History from "../models/historymodel.js";
import mongoose from "mongoose";

// In-memory fallback array when MongoDB is offline
const inMemoryHistory = [];

// Helper: Check if Mongo is connected
const isMongoConnected = () => mongoose.connection.readyState === 1;

// ─── SAVE HISTORY ─────────────────────────────────────────────────────────────
export const saveHistory = async (req, res) => {
  try {
    const {
      input_type,
      original_input,
      verdict,
      confidence,
      explanation,
      sources,
      visual_inconsistencies,
      ai_generation_indicators,
    } = req.body;

    const entryData = {
      _id: new mongoose.Types.ObjectId().toString(),
      userId: req.user?._id || null,
      input_type: input_type || "text",
      original_input: original_input || "",
      verdict: verdict || "Unverified",
      confidence: typeof confidence === "number" ? confidence : 0,
      explanation: explanation || "",
      sources: Array.isArray(sources) ? sources : [],
      visual_inconsistencies: Array.isArray(visual_inconsistencies) ? visual_inconsistencies : [],
      ai_generation_indicators: Array.isArray(ai_generation_indicators) ? ai_generation_indicators : [],
      createdAt: new Date().toISOString(),
    };

    if (isMongoConnected()) {
      const doc = new History({
        input_type: entryData.input_type,
        original_input: entryData.original_input,
        verdict: entryData.verdict,
        confidence: entryData.confidence,
        explanation: entryData.explanation,
        sources: entryData.sources,
        visual_inconsistencies: entryData.visual_inconsistencies,
        ai_generation_indicators: entryData.ai_generation_indicators,
      });
      await doc.save();
      return res.status(201).json({ success: true, data: doc });
    } else {
      // In-memory fallback
      inMemoryHistory.unshift(entryData);
      return res.status(201).json({ success: true, data: entryData });
    }
  } catch (error) {
    console.error("Save History Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET HISTORY ──────────────────────────────────────────────────────────────
export const getHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const type = req.query.type;
    const search = req.query.search;

    if (isMongoConnected()) {
      const query = {};
      if (type) query.input_type = type;
      if (search) {
        query.$or = [
          { original_input: { $regex: search, $options: "i" } },
          { explanation: { $regex: search, $options: "i" } },
          { verdict: { $regex: search, $options: "i" } },
        ];
      }

      const total = await History.countDocuments(query);
      const data = await History.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      return res.json({
        success: true,
        data,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit) || 1,
        },
      });
    } else {
      // In-memory fallback
      let filtered = [...inMemoryHistory];
      if (type) {
        filtered = filtered.filter((h) => h.input_type === type);
      }
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(
          (h) =>
            (h.original_input && h.original_input.toLowerCase().includes(s)) ||
            (h.explanation && h.explanation.toLowerCase().includes(s)) ||
            (h.verdict && h.verdict.toLowerCase().includes(s))
        );
      }

      const total = filtered.length;
      const paginatedData = filtered.slice((page - 1) * limit, page * limit);

      return res.json({
        success: true,
        data: paginatedData,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit) || 1,
        },
      });
    }
  } catch (error) {
    console.error("Get History Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── DELETE HISTORY ───────────────────────────────────────────────────────────
export const deleteHistory = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      await History.findByIdAndDelete(id);
    } else {
      const idx = inMemoryHistory.findIndex((h) => h._id === id);
      if (idx !== -1) inMemoryHistory.splice(idx, 1);
    }

    res.json({ success: true, message: "History item deleted" });
  } catch (error) {
    console.error("Delete History Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
