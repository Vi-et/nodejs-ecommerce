"use strict";

const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: "email-smtp.ap-southeast-1.amazonaws.com",
  port: 465,
  secure: true,
  auth: {
    user: "AKIA3OOR67LCTJJAKZXQ",
    pass: "BLHo0Xq0mtPWsUM3KP8ul4UIGetjn0cUfjRtBQZQHeDn",
  },
});

module.exports = transport;
