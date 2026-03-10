"use strict";

const nodemailer = require("nodemailer");

const createAccount = async () => {
  try {
    let testAccount = await nodemailer.createTestAccount();
    console.log("--- NEW ETHEREAL ACCOUNT ---");
    console.log("USER:", testAccount.user);
    console.log("PASS:", testAccount.pass);
    console.log("---------------------------");
  } catch (err) {
    console.error(err);
  }
};

createAccount();
