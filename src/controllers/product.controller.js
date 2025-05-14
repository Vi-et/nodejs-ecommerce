'use strict';
const { CREATED, OK } = require('../core/success.response');
const ProductService = require('../services/product.service');

class ProductController {

    createProduct = async (req, res, next) => {
        new CREATED({
            message: "Create product successfully",
            metadata: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.keyStore.user._id,
            }),
        }).send(res);
    }

    findAllDraftsForShop = async (req, res, next) => {
        new OK({
            message: "Find all drafts for shop successfully",
            metadata: await ProductService.findAllDraftsForShop(
                req.keyStore.user._id),
        }).send(res);
    }

    findAllPublishedForShop = async (req, res, next) => {
        new OK({
            message: "Find all published for shop successfully",
            metadata: await ProductService.findAllPublishedForShop(
                req.keyStore.user._id),
        }).send(res);
    }

    publishProductByShop = async (req, res, next) => {
        new OK({
            message: "Publish product successfully",
            metadata: await ProductService.publishProductByShop(
                req.keyStore.user._id,
                req.params.id),
        }).send(res);
    }

    unPublishProductByShop = async (req, res, next) => {
        new OK({
            message: "Unpublish product successfully",
            metadata: await ProductService.unPublishProductByShop(
                req.keyStore.user._id,
                req.params.id),
        }).send(res);
    }

    searchProducts = async (req, res, next) => {
        new OK({
            message: "Search products successfully",
            metadata: await ProductService.searchProducts(req.params),
        }).send(res);
    }

    findAllProducts = async (req, res, next) => {
        new OK({
            message: "Find all products successfully",
            metadata: await ProductService.findAllProducts(req.query),
        }).send(res);
    }

}

module.exports = new ProductController();