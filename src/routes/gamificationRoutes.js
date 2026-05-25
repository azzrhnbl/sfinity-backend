const express = require("express");
const router = express.Router();
const {
  getGamificationStatus,
  completeQuest,
} = require("../controllers/gamificationController");
const protect = require("../middleware/authMiddleware");

router.get("/status", protect, getGamificationStatus); // GET  /api/gamification/status
router.post("/quest/complete", protect, completeQuest); // POST /api/gamification/quest/complete

module.exports = router;
