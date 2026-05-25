const User = require("../models/User");

// GET PROFILE
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      //.populate("badges", "name icon description");

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {
    const allowed = ["name", "income_source", "profession", "monthly_income"];
    const updates = {};
    allowed.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select("-password");

    res
      .status(200)
      .json({ success: true, message: "Profil diperbarui.", data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProfile, updateProfile };
