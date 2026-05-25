const User = require("../models/User");
const Quest = require("../models/Quest");
const UserQuest = require("../models/UserQuest");
const Badge = require("../models/Badge");

// GET STATUS GAMIFIKASI
const getGamificationStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .select("name xp level streak badges")
      .populate("badges", "name icon description category");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan.",
      });
    }

    const xpProgress = user.xp % 100;

    const xpForNextLevel = 100;

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);

    tomorrow.setDate(tomorrow.getDate() + 1);

    const dailyQuests = await Quest.find({
      quest_type: "daily",

      is_active: true,
    });

    const questsWithStatus = await Promise.all(
      dailyQuests.map(async (quest) => {
        const userQuest = await UserQuest.findOne({
          user: userId,

          quest: quest._id,

          assigned_date: {
            $gte: today,

            $lt: tomorrow,
          },
        });

        return {
          id: quest._id,

          title: quest.title,

          description: quest.description,

          xp_reward: quest.xp_reward,

          metric: quest.metric,

          quest_type: quest.quest_type,

          target_value: quest.target_value,

          progress: userQuest?.progress || 0,

          is_completed: userQuest?.is_completed || false,
        };
      }),
    );

    return res.status(200).json({
      success: true,

      data: {
        name: user.name,

        level: user.level,

        xp: user.xp,

        xp_progress: xpProgress,

        xp_for_next_level: xpForNextLevel,

        streak: user.streak,

        daily_quests: questsWithStatus,

        badges: user.badges,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// COMPLETE QUEST
const completeQuest = async (req, res) => {
  try {
    const userId = req.user._id;

    const { quest_id } = req.body;

    if (!quest_id) {
      return res.status(400).json({
        success: false,

        message: "quest_id wajib diisi.",
      });
    }

    const quest = await Quest.findById(quest_id);

    if (!quest) {
      return res.status(404).json({
        success: false,

        message: "Quest tidak ditemukan.",
      });
    }

    let userQuest = await UserQuest.findOne({
      user: userId,

      quest: quest_id,
    });

    if (!userQuest) {
      userQuest = await UserQuest.create({
        user: userId,

        quest: quest_id,

        progress: 0,
      });
    }

    if (userQuest.is_completed) {
      return res.status(400).json({
        success: false,

        message: "Quest sudah selesai.",
      });
    }

    userQuest.progress += 1;

    if (userQuest.progress >= quest.target_value) {
      userQuest.is_completed = true;

      userQuest.completed_at = new Date();

      userQuest.xp_awarded = quest.xp_reward;

      const user = await User.findById(userId);

      user.xp += quest.xp_reward;

      user.level = Math.floor(user.xp / 100) + 1;

      await user.save();
    }

    await userQuest.save();

    return res.status(200).json({
      success: true,

      message: "Quest berhasil diproses.",

      data: userQuest,
    });
  } catch (error) {
    console.log(error);

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
