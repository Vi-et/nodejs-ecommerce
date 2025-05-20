'use strict';
const { CREATED, OK } = require('../core/success.response');
const CartService = require('../services/cart.service');

class CartController {

    addToCart = async (req, res, next) => {
        new CREATED({
            message: "Add to cart successfully",
            metadata: await CartService.addToCart({
                userId: req.keyStore.user._id,
                product: req.body,
            }),
        }).send(res);
    }

    update = async (req, res, next) => {

        const { shopOrderIds } = req.body;
        new OK({
            message: "Update cart successfully",
            metadata: await CartService.addToCartV2({
                userId: req.keyStore.user._id,
                shopOrderIds    : shopOrderIds,
            }),
        }).send(res);
    }

    delete = async (req, res, next) => {
        new OK({
            message: "Delete cart successfully",
            metadata: await CartService.deleteUserCart({
                userId: req.keyStore.user._id,
                productId: req.body.productId,
            }),
        }).send(res);
    }

    list = async (req, res, next) => {
        new OK({
            message: "List cart successfully",
            metadata: await CartService.getListUserCart({userId:req.keyStore.user._id}),
        }).send(res);
    }

   
}

module.exports = new CartController();