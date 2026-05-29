const {
  createTransactionService,
  getTransactionsService,
  getTransactionSummaryService,
  updateTransactionService,
  deleteTransactionService,
} = require("../services/transactionService");

// CREATE TRANSACTION
const createTransaction = async (req, res) => {
  try {
    const transaction = await createTransactionService(req.user._id, req.body);

    res.status(201).json({
      message: "Transaction created successfully",

      transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL TRANSACTIONS
const getTransactions = async (req, res) => {
  try {
    const transactions = await getTransactionsService(req.user._id);

    res.status(200).json({
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET TRANSACTION SUMMARY
const getTransactionSummary = async (req, res) => {
  try {
    const summary = await getTransactionSummaryService(req.user._id);

    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE TRANSACTION
const updateTransaction = async (req, res) => {
  try {
    const transaction = await updateTransactionService(
      req.params.id,
      req.user._id,
      req.body,
    );

    res.status(200).json({
      message: "Transaction updated successfully",

      transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE TRANSACTION
const deleteTransaction = async (req, res) => {
  try {
    await deleteTransactionService(req.params.id, req.user._id);

    res.status(200).json({
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionSummary,
  updateTransaction,
  deleteTransaction,
};