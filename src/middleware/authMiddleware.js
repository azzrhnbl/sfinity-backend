const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    // cek authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log("DECODED TOKEN:", decoded);

      // ambil user dari database
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      next();
    } else {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      message: "Token failed",
    });
  }
};

module.exports = protect;
