const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const { getProfile } = require("../controllers/profileController");

// protected route
router.get("/", protect, getProfile);

module.exports = router;
