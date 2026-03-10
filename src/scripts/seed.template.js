"use strict";

/**
 * Script seed template email vào MongoDB
 * Chỉ cần chạy MỘT LẦN khi setup dự án
 *
 * Cách chạy:
 *   node src/scripts/seed.template.js
 */

// Khởi tạo kết nối MongoDB trước
require("../dbs/init.mongo");

const { newTemplate } = require("../services/template.service");

const seedTemplates = async () => {
  console.log("🌱 Seeding email templates...\n");

  try {
    const result = await newTemplate({
      tem_id: 1,
      tem_name: "HTML EMAIL TOKEN",
    });

    if (result) {
      console.log("✅ Template seeded successfully!");
      console.log("   Name   :", result.tem_name);
      console.log("   ID     :", result.tem_id);
      console.log("   Status :", result.tem_status);
    }
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
  } finally {
    console.log("\n🏁 Done. You can now send OTP emails.");
    process.exit(0);
  }
};

// Đợi MongoDB kết nối xong rồi mới seed
setTimeout(seedTemplates, 1500);
