const {
  getProfileService,
  updateProfileService,
} = require("../services/profileService");

// GET PROFILE
const getProfile = async (req, res) => {
  try {
    const data = await getProfileService(req.user._id);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {
    const data = await updateProfileService(req.user._id, req.body);

    res.status(200).json({
      success: true,
      message: "Profil diperbarui.",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
