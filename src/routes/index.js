'use strict'

const express = require('express')
const { apiKey, permission,   } = require('../auth/checkAuth')
const router = express.Router()

// router.use(apiKey)
// router.use(permission('0000'))

router.use('/v1/api/product', require('./product'))
router.use('/v1/api/discount', require('./discount'))
router.use('/v1/api/cart', require('./cart'))
router.use('/v1/api/user', require('./access'))
router.use('/v1/api/comment', require('./comment'))
router.use('/v1/api/notification', require('./notification'))
router.use('/v1/api/upload', require('./upload'))

module.exports = router