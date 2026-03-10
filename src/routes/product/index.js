"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const router = express.Router();
const { asyncHandler } = require("../../auth/checkAuth");
const { authentication } = require("../../auth/authUtils");

router.get(
  "/search/:keySearch",
  asyncHandler(productController.searchProducts),
);
router.get("/sku", asyncHandler(productController.findOneSku));
router.get("", asyncHandler(productController.findAllProducts));
router.get("/:id", asyncHandler(productController.findProduct));
router.use(authentication);

router.post("/spu/new", asyncHandler(productController.createSpu));

router.post("", asyncHandler(productController.createProduct));
router.get("/drafts/all", asyncHandler(productController.findAllDraftsForShop));
router.get(
  "/published/all",
  asyncHandler(productController.findAllPublishedForShop),
);
router.put(
  "/publish/:id",
  asyncHandler(productController.publishProductByShop),
);
router.put(
  "/unpublish/:id",
  asyncHandler(productController.unPublishProductByShop),
);
router.patch("/:id", asyncHandler(productController.updateProduct));
module.exports = router;
