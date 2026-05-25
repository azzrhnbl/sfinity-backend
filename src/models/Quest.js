const mongoose = require("mongoose");

const questSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    xp_reward: {
      type: Number,
      required: true,
    },

    quest_type: {
      type: String,
      enum: ["daily", "weekly"],
      default: "daily",
    },

    metric: {
      type: String,
      enum: ["login", "transaction", "saving", "article"],
      required: true,
    },

    target_value: {
      type: Number,
      default: 1,
    },

    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Quest", questSchema);
