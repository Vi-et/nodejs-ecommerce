"use strict";

const { newUser } = require("../services/user.service");
const { OK } = require("../core/success.response");

class UserController {
  /**
   * POST /v1/api/user/new-user
   * Body: { email, captcha }
   */
  newUser = async (req, res, next) => {
    try {
      const result = await newUser({
        email: req.body.email,
        captcha: req.body.captcha,
      });

      new OK({
        message: "Verify your email to complete registration!",
        metadata: result,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new UserController();
