'use strict';
const { CREATED, OK } = require('../core/success.response');
const DiscountService = require('../services/discount.service');

class DiscountController {

    createDiscount = async (req, res, next) => {
        new CREATED({
            message: "Create product successfully",
            metadata: await DiscountService.createDiscount({...req.body, shopId: req.keyStore.user._id}),
        }).send(res);
    }

    updateDiscount = async (req, res, next) => {
        new OK({
            message: "Update discount successfully",
            metadata: await DiscountService.updateDiscount(req.params.id, req.body),
        }).send(res);
    }

    getAllDiscountCodesWithProduct = async (req, res, next) => {
        new OK({
            message: "Get all discount codes successfully",
            metadata: await DiscountService.getAllDiscountCodesWithProduct({
                code: req.query.code,
                shopId: req.query.shopId,
                limit: req.query.limit,
                page: req.query.page
            }),
        }).send(res);
    }
    
}

module.exports = new DiscountController();