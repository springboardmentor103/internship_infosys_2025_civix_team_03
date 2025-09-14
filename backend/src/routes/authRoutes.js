const express = require("express");
const { register, login, refresh, logout, me ,verifyOtp,  forgotPassword,resetPassword } = require("../controllers/authController");
const { auth } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", auth, me);

module.exports = router;
