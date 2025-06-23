const express = require("express");
const router = express.Router();
const staffController = require("../Controllers/staffs");

router.post("/login", staffController.login);
router.post("/send-otp", staffController.sendOtp);
router.post("/verify-otp", staffController.verifyOtp);
router.post("/update-password", staffController.updatePassword);

module.exports = router;
