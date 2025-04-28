'use strict';
const { CREATED, OK } = require('../core/success.response');
const accessService = require('../services/access.service');

class AccessController {
    logIn = async (req, res, next) => {
        new OK({
            message: "Login successfully",
            metadata: await accessService.logIn(req.body),
        }).send(res);
    }


    signUp = async (req, res, next) => {
        new CREATED({
            message: "User created successfully",
            metadata: await accessService.signUp(req.body),
        }
        ).send(res);
    }

    logOut = async (req, res, next) => {
        new OK({
            message: "Logout successfully",
            metadata: await accessService.logOut(req.keyStore),
        }).send(res);
    }
}

module.exports = new AccessController();