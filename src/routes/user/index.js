"use strict";

const express = require("express");
const router = express.Router();
const userController = require("../../controllers/user.controller");
const { asyncHandler } = require("../../auth/checkAuth");

/**
 * POST /v1/api/user/new-user
 * Body: { email: string, captcha: string }
 * Desc: Đăng ký user mới — gửi OTP qua email để xác thực
 */
router.post("/new-user", asyncHandler(userController.newUser));

module.exports = router;
