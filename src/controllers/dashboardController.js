const User = require("../models/User");
const Transaction = require("../models/Transaction");

const getDashboard = async (req, res) => {
  try {
    // ambil user
    const user = await User.findById(req.user._id).select("-password");

    // ambil transaksi user
    const transactions = await Transaction.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    // hitung summary
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((acc, curr) => acc + curr.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, curr) => acc + curr.amount, 0);

    const balance = totalIncome - totalExpense;

    // ambil 5 transaksi terbaru
    const recentTransactions = transactions.slice(0, 5);

    res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
        level: user.level,
        xp: user.xp,
        streak: user.streak,
      },

      summary: {
        total_income: totalIncome,
        total_expense: totalExpense,
        balance,
      },

      recent_transactions: recentTransactions,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboard,
};
