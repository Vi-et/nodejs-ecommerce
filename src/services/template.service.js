"use strict";

const TEMPLATE = require("../models/template.model");
const { htmlEmailToken } = require("../utils/tem.html");

/**
 * Tạo template mới vào DB (chỉ gọi 1 lần khi seed data)
 * Kiểm tra tên trùng trước khi tạo để tránh duplicate
 */
const newTemplate = async ({
  tem_name,
  tem_id = Date.now(), // tự sinh id nếu không truyền
}) => {
  // 1. check if template exists
  const existingTemplate = await TEMPLATE.findOne({ tem_name });
  if (existingTemplate) {
    return existingTemplate; // trả về template cũ nếu đã tồn tại
  }

  // 2. create a new template — lưu HTML tĩnh (có placeholder {{$otp_token}})
  const newTem = await TEMPLATE.create({
    tem_id,
    tem_name,
    tem_html: htmlEmailToken(), // HTML với placeholder, chưa fill token
  });

  return newTem;
};

/**
 * Lấy template theo tên
 */
const getTemplate = async ({ tem_name }) => {
  const template = await TEMPLATE.findOne({ tem_name });

  if (!template) throw new Error(`Template not found: ${tem_name}`);

  return template;
};

module.exports = {
  newTemplate,
  getTemplate,
};
