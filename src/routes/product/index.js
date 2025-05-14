'use strict'

const express = require('express')
const productController = require('../../controllers/product.controller')
const router = express.Router()
const {asyncHandler} = require('../../auth/checkAuth')
const { authentication } = require('../../auth/authUtils')

router.get('/search/:keySearch', asyncHandler(productController.searchProducts))

router.use(authentication)
router.post('', asyncHandler(productController.createProduct))
router.get('/drafts/all', asyncHandler(productController.findAllDraftsForShop))
router.get('/published/all', asyncHandler(productController.findAllPublishedForShop))
router.put('/publish/:id', asyncHandler(productController.publishProductByShop))
module.exports = router