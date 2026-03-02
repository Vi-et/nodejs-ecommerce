'use strict'

const express = require('express')
const commentController = require('../../controllers/comment.controller')
const router = express.Router()
const {asyncHandler} = require('../../auth/checkAuth')
const { authentication } = require('../../auth/authUtils')

router.use(authentication)
router.post('', asyncHandler(commentController.createComment))
router.get('', asyncHandler(commentController.getCommentsByParentId))


module.exports = router;