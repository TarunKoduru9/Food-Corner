const express = require("express");
const router = express.Router();
const {
  login,
  sendOtp,
  verifyOtp,
  resetPassword,
  getDashboardStats,
} = require("../controller/admin_authController");
const { verifyAdminToken  } = require("../middleware/verifyAdminToken");


router.post("/login", login);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

router.get("/dashboard", getDashboardStats);


module.exports = router;
