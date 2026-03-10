"use strict";

const { newOtp } = require("./otp.service");
const { getTemplate } = require("./template.service");
const { replacePlaceholder } = require("../utils");
const transport = require("../dbs/init.nodemailer");

/**
 * Hàm nội bộ: gửi email thông qua Nodemailer
 */
const sendEmailLinkVerify = ({
  html,
  toEmail,
  subject = "Xác nhận Email đăng ký!",
  text = "Vui lòng xác nhận email của bạn.",
  fromEmail = process.env.EMAIL_SENDER_DEFAULT ||
    '"ShopZone" <no-reply@shopzone.com>',
}) => {
  const mailOptions = {
    from: fromEmail,
    to: toEmail,
    subject,
    text,
    html,
  };

  return new Promise((resolve, reject) => {
    transport.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Send email error::", err);
        return reject(err);
      }
      console.log("Message sent::", info.messageId);
      resolve(info);
    });
  });
};

/**
 * Hàm chính:
 * 1. Tạo OTP mới (lưu vào DB, tự hết hạn sau 60s)
 * 2. Lấy HTML template từ DB
 * 3. Thay placeholder {{$otp_token}} bằng token thật
 * 4. Gửi email
 */
const sendEmailToken = async ({ email = null }) => {
  // 1. Tạo OTP và lưu vào DB
  const otpDoc = await newOtp({ email });
  const otp_token = otpDoc.otp_token;

  // 2. Lấy template HTML từ DB
  const template = await getTemplate({
    tem_name: "HTML EMAIL TOKEN",
  });

  // 3. Thay placeholder {{$otp_token}} bằng mã thật
  const htmlWithToken = replacePlaceholder(template.tem_html, {
    otp_token, // {{$otp_token}} → mã số thực tế
  });

  // 4. Gửi email
  await sendEmailLinkVerify({
    html: htmlWithToken,
    toEmail: email,
    subject: "Vui lòng xác nhận địa chỉ Email đăng ký",
  });

  return { message: "Email sent successfully", otp_token };
};

module.exports = {
  sendEmailToken,
};
