const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    icon: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      enum: ["streak", "hemat", "challenge", "level"],

      default: "challenge",
    },

    xp_reward: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Badge", badgeSchema);
