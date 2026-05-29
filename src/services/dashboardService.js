const Transaction = require("../models/Transaction");

const getDashboardService = async (user, query) => {
  const userId = user._id;

  const now = new Date();

  const month = parseInt(query.month) || now.getMonth() + 1;

  const year = parseInt(query.year) || now.getFullYear();

  const start = new Date(year, month - 1, 1);

  const end = new Date(year, month, 1);

  // transaksi bulan ini
  const transactions = await Transaction.find({
    user: userId,

    transaction_date: {
      $gte: start,

      $lt: end,
    },
  }).sort({
    transaction_date: -1,
  });

  // income
  const total_income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  // expense
  const total_expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // balance
  const balance = total_income - total_expense;

  // health score
  const health_score =
    total_income > 0
      ? Math.round(
          Math.max(0, Math.min(100, (balance / total_income) * 100 + 50)),
        )
      : 0;

  // kategori
  const by_category = {};

  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      by_category[t.category] = (by_category[t.category] || 0) + t.amount;
    });

  // recent
  const recent_transactions = transactions.slice(0, 5);

  return {
    success: true,

    data: {
      month,
      year,

      summary: {
        total_income,
        total_expense,
        balance,
        health_score,
      },

      by_category,

      recent_transactions,

      user: {
        name: user.name,

        email: user.email,

        level: user.level,

        xp: user.xp,

        streak: user.streak,
      },
    },
  };
};

module.exports = {
  getDashboardService,
};
