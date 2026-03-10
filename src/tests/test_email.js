"use strict";

require("dotenv").config();
require("../dbs/init.mongo"); // Kết nối DB để lưu OTP vào db và lấy template
const { sendEmailToken } = require("../services/email.service");

const testEmail = async () => {
  try {
    console.log("📨 Sending OTP to viet.dangnhat253@gmail.com...");
    const result = await sendEmailToken({
      email: "viet.dangnhat253@gmail.com",
    });
    console.log("✅ Success:", result);
  } catch (error) {
    console.error("❌ Failed:", error.message);
  } finally {
    // Đợi một chút để log xong rồi thoát
    setTimeout(() => process.exit(0), 1000);
  }
};

testEmail();
