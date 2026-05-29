const User = require("../models/User");

// GET PROFILE
const getProfileService = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new Error("User tidak ditemukan.");
  }

  return user;
};

// UPDATE PROFILE
const updateProfileService = async (userId, body) => {
  const allowed = ["name", "income_source", "profession", "monthly_income"];

  const updates = {};

  allowed.forEach((field) => {
    if (body[field] !== undefined) {
      updates[field] = body[field];
    }
  });

  const user = await User.findByIdAndUpdate(userId, updates, {
    returnDocument: "after",
  }).select("-password");

  if (!user) {
    throw new Error("User tidak ditemukan.");
  }

  return user;
};

module.exports = {
  getProfileService,
  updateProfileService,
};
