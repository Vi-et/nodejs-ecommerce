'use strict'

const express = require('express')
const DiscountController = require('../../controllers/discount.controller')
const router = express.Router()
const {asyncHandler} = require('../../auth/checkAuth')
const { authentication } = require('../../auth/authUtils')


// router.use(authentication)
router.get("/list-products", asyncHandler(DiscountController.getAllDiscountCodesWithProduct))

router.post('', asyncHandler(DiscountController.createDiscount))
router.patch('/:id', asyncHandler(DiscountController.updateDiscount))

module.exports = router