"use strict";

const SKU_MODEL = require("../models/sku.model");
const { randomProductId } = require("../utils");
const _ = require("lodash");
const { CACHE_PRODUCT } = require("../configs/constant");
const {
  getCacheIO,
  setCacheIOExpiration,
} = require("../models/repositories/cache.redis");

const newSku = async ({ spu_id, sku_list }) => {
  try {
    const convert_sku_list = sku_list.map((sku) => {
      return {
        ...sku,
        product_id: spu_id,
        sku_id: `${spu_id}.${randomProductId()}`,
      };
    });
    const skus = await SKU_MODEL.create(convert_sku_list);
    return skus;
  } catch (error) {
    return [];
  }
};

const oneSku = async ({ sku_id, product_id }) => {
  try {
    // read cache
    if (sku_id < 0) return null;
    if (product_id < 0) return null;

    const skuKeyCache = `${CACHE_PRODUCT.SKU}:${sku_id}`;
    const skuCache = await getCacheIO({ key: skuKeyCache });

    if (skuCache) {
      console.log("cache hit");
      return {
        ...JSON.parse(skuCache),
        toLoad: "cache",
      };
    }

    console.log("cache miss - db");
    const sku = await SKU_MODEL.findOne({
      sku_id,
      product_id,
    }).lean();

    if (!sku) return null;

    console.log("DB Result:", sku);

    // Set cache (background)
    setCacheIOExpiration({
      key: skuKeyCache,
      value: JSON.stringify(sku),
      expirationInSeconds: 30,
    }).catch((err) => console.error("Error setting cache:", err));

    return {
      ...sku,
      toLoad: "db",
    };
  } catch (error) {
    console.error("Error in oneSku:", error);
    return null;
  }
};

const findAllSkus = async ({ product_id }) => {
  try {
    // read cache

    console.log(product_id);
    const sku = await SKU_MODEL.find({
      product_id,
    }).lean();

    if (sku) {
      // set cached
    }

    return _.omit(sku, [
      "__v",
      "isDeleted",
      "isDraft",
      "isPublished",
      "createdAt",
    ]);
  } catch (error) {
    return null;
  }
};

module.exports = {
  newSku,
  oneSku,
  findAllSkus,
};
