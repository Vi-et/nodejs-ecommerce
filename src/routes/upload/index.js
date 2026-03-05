'use strict'

const express = require('express')
const uploadController = require('../../controllers/upload.controller')
const router = express.Router()
const {asyncHandler} = require('../../auth/checkAuth')
const {uploadDisk} = require('../../configs/multer.config')

router.post('/product/upload', asyncHandler(uploadController.uploadImage))
router.post('/product/upload/thumb', uploadDisk.single('file'), asyncHandler(uploadController.uploadImageLocal))
router.post('/product/upload/thumbs', uploadDisk.array('files', 10), asyncHandler(uploadController.uploadImagesLocal))

module.exports = router