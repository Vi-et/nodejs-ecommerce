"use strict";

const shopModel = require("../models/shop.model");

const findByEmail = async (
  email,
  select = {
    email: 1,
    password: 2,
    name: 1,
    status: 1,
    roles: 1,
  },
) => {
  return await shopModel.findOne({ email }).select(select).lean();
};

// ────────────────────────────────────────────
const USER = require("../models/user.model");
const { sendEmailToken } = require("./email.service");
const { BadRequestError } = require("../core/error.response");
const { OK } = require("../core/success.response");

/**
 * Đăng ký user mới:
 * 1. Kiểm tra email đã tồn tại chưa
 * 2. Gửi OTP qua email để xác thực
 */
const newUser = async ({ email = null, captcha = null }) => {
  // 1. Kiểm tra email đã tồn tại trong DB chưa
  const existingUser = await USER.findOne({ email }).lean();

  if (existingUser) {
    throw new BadRequestError("Email already exists");
  }

  // 2. Gửi OTP qua email
  const result = await sendEmailToken({ email });

  return result;
};

module.exports = {
  findByEmail,
  newUser,
};
