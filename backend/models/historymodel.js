import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    input_type: {
      type: String,
      enum: ["text", "image", "voice", "ai_image"],
      required: true,
    },
    original_input: {
      type: String,
      maxlength: 5000,
      default: "",
    },
    verdict: {
      type: String,
      required: true,
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    explanation: {
      type: String,
      maxlength: 10000,
      default: "",
    },
    visual_inconsistencies: {
      type: [String],
      default: [],
    },
    ai_generation_indicators: {
      type: [String],
      default: [],
    },
    sources: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Optimized for querying latest first
historySchema.index({ createdAt: -1 });
historySchema.index({ userId: 1, createdAt: -1 });
historySchema.index({ input_type: 1, createdAt: -1 });

const History = mongoose.model("History", historySchema);
export default History;
