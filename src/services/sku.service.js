"use strict";

const SKU_MODEL = require("../models/sku.model");
const { randomProductId } = require("../utils");
const _ = require("lodash");

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

    console.log(sku_id, product_id);
    const sku = await SKU_MODEL.findOne({
      sku_id,
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

const findAllSkus = async ({ product_id }) => {
  try {
    // read cache

    console.log(sku_id, product_id);
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
