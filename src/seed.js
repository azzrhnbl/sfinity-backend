const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const Quest = require("./models/Quest");
const Badge = require("./models/Badge");

const seed = async () => {
  try {
    await connectDB();

    await Quest.deleteMany({});
    await Quest.insertMany([
      {
        title: "Daily Check-in",
        description: "Login hari ini",
        xp_reward: 5,
        quest_type: "daily",
        metric: "login",
        target_value: 1,
      },
      {
        title: "Input Transaksi",
        description: "Catat minimal 1 transaksi hari ini",
        xp_reward: 10,
        quest_type: "daily",
        metric: "transaction",
        target_value: 1,
      },
      {
        title: "Hemat 7 Hari",
        description: "Tidak ada pengeluaran hiburan 7 hari",
        xp_reward: 50,
        quest_type: "weekly",
        metric: "saving",
        target_value: 7,
      },
      {
        title: "Baca Artikel",
        description: "Baca 1 artikel edukasi",
        xp_reward: 20,
        quest_type: "daily",
        metric: "article",
        target_value: 1,
      },
    ]);
    console.log("✅ Quests seeded!");

    await Badge.deleteMany({});
    await Badge.insertMany([
      {
        name: "Pemula Bijak",
        description: "Selesaikan onboarding",
        icon: "🌱",
        category: "challenge",
      },
      {
        name: "Hemat 7 Hari",
        description: "Tidak jajan 7 hari",
        icon: "💰",
        category: "hemat",
      },
      {
        name: "Konsisten",
        description: "Login 7 hari",
        icon: "🔥",
        category: "streak",
      },
      {
        name: "Investor Muda",
        description: "Saldo lebih besar dari pengeluaran",
        icon: "📈",
        category: "level",
      },
    ]);
    console.log("✅ Badges seeded!");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
