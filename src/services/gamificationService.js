const User = require("../models/User");
const Quest = require("../models/Quest");
const UserQuest = require("../models/UserQuest");

require("../models/Badge");

const getStatusService = async (userId) => {
  const user = await User.findById(userId)
    .select("name xp level streak badges")
    .populate("badges", "name icon description category");

  if (!user) {
    throw new Error("User tidak ditemukan.");
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);

  tomorrow.setDate(tomorrow.getDate() + 1);

  const quests = await Quest.find({
    quest_type: "daily",

    is_active: true,
  });

  const daily = await Promise.all(
    quests.map(async (quest) => {
      const progress = await UserQuest.findOne({
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

        progress: progress?.progress || 0,

        is_completed: progress?.is_completed || false,
      };
    }),
  );

  return {
    success: true,

    data: {
      name: user.name,

      level: user.level,

      xp: user.xp,

      xp_progress: user.xp % 100,

      xp_for_next_level: 100,

      streak: user.streak,

      daily_quests: daily,

      badges: user.badges,
    },
  };
};

const completeQuestService = async (userId, quest_id) => {
  const quest = await Quest.findById(quest_id);

  if (!quest) {
    throw new Error("Quest tidak ditemukan.");
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
    throw new Error("Quest sudah selesai.");
  }

  userQuest.progress++;

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

  return {
    success: true,

    message: "Quest berhasil diproses.",

    data: userQuest,
  };
};

module.exports = {
  getStatusService,
  completeQuestService,
};
