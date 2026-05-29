const { registerService, loginService } = require("../services/authService");

// REGISTER
const register = async (req, res) => {
  try {
    const data = await registerService(req.body);

    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const data = await loginService(req.body);

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
};
