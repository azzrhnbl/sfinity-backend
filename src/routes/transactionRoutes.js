const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createTransaction,
  getTransactions,
  getTransactionSummary,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");

// CREATE & GET
router
  .route("/")
  .post(protect, createTransaction)
  .get(protect, getTransactions);

// SUMMARY
router.get("/summary", protect, getTransactionSummary);

// UPDATE & DELETE
router
  .route("/:id")
  .put(protect, updateTransaction)
  .delete(protect, deleteTransaction);

module.exports = router;
