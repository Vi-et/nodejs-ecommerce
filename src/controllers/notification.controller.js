'use strict';
const { OK } = require('../core/success.response');
const { listNotiByUser } = require('../services/notification.service');

class NotificationController {

    listNotiByUser = async (req, res, next) => {
        new OK({
            message: "List notifications by user successfully",
            metadata: await listNotiByUser(req.query),
        }).send(res);
    }

}

module.exports = new NotificationController();