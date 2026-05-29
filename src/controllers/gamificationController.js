const {
  getStatusService,
  completeQuestService,
} = require("../services/gamificationService");

const getGamificationStatus = async (req, res) => {
  try {
    const result = await getStatusService(req.user._id);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

const completeQuest = async (req, res) => {
  try {
    const result = await completeQuestService(
      req.user._id,

      req.body.quest_id,
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

module.exports = {
  getGamificationStatus,
  completeQuest,
};
