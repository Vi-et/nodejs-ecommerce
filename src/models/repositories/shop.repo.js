"use strict";
const select = {
  email: 1,
  name: 1,
  status: 1,
  roles: 1,
};
const Shop = require("../shop.model");
const findShopById = async ({ shop_id }) => {
  return await Shop.findOne({ _id: shop_id }).select(select).lean();
};

module.exports = {
  findShopById,
};
