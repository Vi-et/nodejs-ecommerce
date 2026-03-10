"use strict";
const { CREATED, OK, SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");
const { newSpu } = require("../services/spu.service");
const { oneSku, findAllSkus } = require("../services/sku.service");
class ProductController {
  // SPU, SKU //
  createSpu = async (req, res, next) => {
    try {
      const spu = await newSpu({
        ...req.body,
        product_shop: req.keyStore.user,
      });
      new SuccessResponse({
        message: "Success create spu",
        metadata: spu,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  findOneSku = async (req, res, next) => {
    try {
      const { sku_id, product_id } = req.query;
      new SuccessResponse({
        message: " get sku one",
        metadata: await oneSku({ sku_id, product_id }),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  findAllSkus = async (req, res, next) => {
    try {
      const { product_id } = req.query;
      new SuccessResponse({
        message: " get sku one",
        metadata: await findAllSkus({ product_id }),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  createProduct = async (req, res, next) => {
    new CREATED({
      message: "Create product successfully",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.keyStore.user._id,
      }),
    }).send(res);
  };

  findAllDraftsForShop = async (req, res, next) => {
    new OK({
      message: "Find all drafts for shop successfully",
      metadata: await ProductService.findAllDraftsForShop(
        req.keyStore.user._id,
      ),
    }).send(res);
  };

  findAllPublishedForShop = async (req, res, next) => {
    new OK({
      message: "Find all published for shop successfully",
      metadata: await ProductService.findAllPublishedForShop(
        req.keyStore.user._id,
      ),
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    new OK({
      message: "Publish product successfully",
      metadata: await ProductService.publishProductByShop(
        req.keyStore.user._id,
        req.params.id,
      ),
    }).send(res);
  };

  unPublishProductByShop = async (req, res, next) => {
    new OK({
      message: "Unpublish product successfully",
      metadata: await ProductService.unPublishProductByShop(
        req.keyStore.user._id,
        req.params.id,
      ),
    }).send(res);
  };

  searchProducts = async (req, res, next) => {
    new OK({
      message: "Search products successfully",
      metadata: await ProductService.searchProducts(req.params),
    }).send(res);
  };

  findAllProducts = async (req, res, next) => {
    new OK({
      message: "Find all products successfully",
      metadata: await ProductService.findAllProducts(req.query),
    }).send(res);
  };

  findProduct = async (req, res, next) => {
    new OK({
      message: "Find product successfully",
      metadata: await ProductService.findProduct(req.params.id),
    }).send(res);
  };

  updateProduct = async (req, res, next) => {
    new OK({
      message: "Update product successfully",
      metadata: await ProductService.updateProduct(
        req.body.product_type,
        req.params.id,
        { ...req.body, product_shop: req.keyStore.user._id },
      ),
    }).send(res);
  };
}

module.exports = new ProductController();
