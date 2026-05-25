const Transaction = require("../models/Transaction");

const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const month = parseInt(req.query.month) || now.getMonth() + 1;
    const year = parseInt(req.query.year) || now.getFullYear();

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    // Ambil transaksi bulan ini
    const transactions = await Transaction.find({
      user: userId,
      transaction_date: { $gte: start, $lt: end },
    }).sort({ transaction_date: -1 });

    // Hitung summary
    const total_income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const total_expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = total_income - total_expense;
    const health_score =
      total_income > 0
        ? Math.round(
            Math.max(0, Math.min(100, (balance / total_income) * 100 + 50)),
          )
        : 0;

    // Breakdown per kategori
    const by_category = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        by_category[t.category] = (by_category[t.category] || 0) + t.amount;
      });

    // 5 transaksi terbaru
    const recent_transactions = transactions.slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        month,
        year,
        summary: { total_income, total_expense, balance, health_score },
        by_category,
        recent_transactions,
        user: {
          name: req.user.name,
          email: req.user.email,
          level: req.user.level,
          xp: req.user.xp,
          streak: req.user.streak,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboard };
