const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },

    // Financial Profiling
    income_source: {
      type: String,
      default: "other",
    },
    profession: {
      type: String,
      default: "other",
    },
    monthly_income: { type: Number, default: 0 },

    // Gamifikasi
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 0 },
    last_active: { type: Date, default: null },

    // Badges
    badges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Badge" }],
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
