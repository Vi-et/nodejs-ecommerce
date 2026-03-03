'use strict'

const express = require('express')
const notificationController = require('../../controllers/notification.controller')
const router = express.Router()
const {asyncHandler} = require('../../auth/checkAuth')
const { authentication } = require('../../auth/authUtils')

router.use(authentication)
router.get('', asyncHandler(notificationController.listNotiByUser))

module.exports = router