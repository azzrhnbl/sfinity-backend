const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const gamificationRoutes = require("./routes/gamificationRoutes");

const app = express();

// middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
app.use(cors());
app.use(express.json());

// root route
app.get("/", (req, res) => {
  res.send("Backend SFINITY running");
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/gamification", gamificationRoutes);

module.exports = app;
