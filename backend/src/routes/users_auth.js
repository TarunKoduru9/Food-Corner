const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  sendOtp,
  verifyOtp,
  resetPassword,
  categories,
  getAllFoodItems,
  getItemsByCategory,
  getMe,
  createOrderStatus,
  updateUser,
  googleLogin,
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} = require("../controller/users_authController");
const { authenticateToken } = require("../middleware/authMiddleware");

// Public Routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.post("/google", googleLogin);

//  Public Data
router.get("/categories", categories);
router.get("/", getAllFoodItems);
router.get("/category/:id/items", getItemsByCategory);

//  Protected Routes
router.get("/me", authenticateToken, getMe);
router.patch("/update", authenticateToken, updateUser);
router.post("/order-status", authenticateToken, createOrderStatus);
router.post("/address", authenticateToken, addAddress);
router.get("/address", authenticateToken, getAddresses);
router.put("/address/:id",authenticateToken, updateAddress);   
router.delete("/address/:id",authenticateToken, deleteAddress); 

module.exports = router;
