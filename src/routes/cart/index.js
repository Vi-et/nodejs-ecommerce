'use strict'

const express = require('express')
const CartController = require('../../controllers/cart.controller')
const router = express.Router()
const {asyncHandler} = require('../../auth/checkAuth')
const { authentication } = require('../../auth/authUtils')


router.use(authentication)
router.post('', asyncHandler(CartController.addToCart))
router.get("", asyncHandler(CartController.list))
router.delete('', asyncHandler(CartController.delete))
router.post('/update', asyncHandler(CartController.update))

module.exports = router