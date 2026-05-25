const mongoose = require("mongoose");

const userQuestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    quest: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Quest",

      required: true,
    },

    assigned_date: {
      type: Date,

      default: Date.now,
    },

    progress: {
      type: Number,

      default: 0,
    },

    is_completed: {
      type: Boolean,

      default: false,
    },

    completed_at: {
      type: Date,

      default: null,
    },

    xp_awarded: {
      type: Number,

      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// supaya user ga dapet quest dobel
userQuestSchema.index(
  {
    user: 1,
    quest: 1,
  },
  {
    unique: true,
  },
);

module.exports = mongoose.model("UserQuest", userQuestSchema);
