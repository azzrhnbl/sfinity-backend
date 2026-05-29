const Transaction = require("../models/Transaction");

// CREATE TRANSACTION
const createTransactionService = async (userId, body) => {
  const { type, category, amount, description, transaction_date } = body;

  const transaction = await Transaction.create({
    user: userId,
    type,
    category,
    amount,
    description,
    transaction_date,
  });

  return transaction;
};

// GET ALL TRANSACTIONS
const getTransactionsService = async (userId) => {
  return await Transaction.find({
    user: userId,
  }).sort({
    createdAt: -1,
  });
};

// GET TRANSACTION SUMMARY
const getTransactionSummaryService = async (userId) => {
  const transactions = await Transaction.find({
    user: userId,
  });

  let total_income = 0;

  let total_expense = 0;

  transactions.forEach((transaction) => {
    if (transaction.type === "income") {
      total_income += transaction.amount;
    } else {
      total_expense += transaction.amount;
    }
  });

  const balance = total_income - total_expense;

  return {
    total_income,
    total_expense,
    balance,
  };
};

// UPDATE TRANSACTION
const updateTransactionService = async (id, userId, body) => {
  const transaction = await Transaction.findOne({
    _id: id,
    user: userId,
  });

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  const updatedTransaction = await Transaction.findByIdAndUpdate(id, body, {
    returnDocument: "after",
  });

  return updatedTransaction;
};

// DELETE TRANSACTION
const deleteTransactionService = async (id, userId) => {
  const transaction = await Transaction.findOne({
    _id: id,
    user: userId,
  });

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  await transaction.deleteOne();

  return true;
};

module.exports = {
  createTransactionService,
  getTransactionsService,
  getTransactionSummaryService,
  updateTransactionService,
  deleteTransactionService,
};
