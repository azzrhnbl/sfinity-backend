const { getDashboardService } = require("../services/dashboardService");

const getDashboard = async (req, res) => {
  try {
    const result = await getDashboardService(req.user, req.query);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboard,
};
