'use strict'

const { keyBy } = require('lodash')
const {product, clothing, electronic, furniture} = require('../product.model')

const findAllDraftsForShop = async (query, limit, skip) => {
    return await queryProduct(query, skip, limit)
}

const findAllPublishedForShop = async (query, limit, skip) => {
    return await queryProduct(query, skip, limit)
}

const publishProductByShop = async (shopId, productId) => {
  
        const foundShop = await product.findOne({product_shop: shopId, _id: productId})
        if(!foundShop) return null
        foundShop.isDraft = false
        foundShop.isPublished = true
        const {modifiedCount} = await foundShop.updateOne(foundShop)
        return modifiedCount
}

const unPublishProductByShop = async (shopId, productId) => {
        const foundShop = await product.findOne({product_shop: shopId, _id: productId})
        if(!foundShop) return null
        foundShop.isDraft = true
        foundShop.isPublished = false
        const {modifiedCount} = await foundShop.updateOne(foundShop)
        return modifiedCount
}

const queryProduct = async (query, skip, limit) => {
    return await product
        .find(query)
        .populate('product_shop', 'name email -_id')
        .sort({updatedAt: -1})
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
}

const searchProducts = async (keySearch) => {
    const regexSearch = new RegExp(keySearch)
    const results = await product.find({
        isDraft: false,
        $text: {
            $search: regexSearch
        }},
        {score: {$meta: "textScore"}
}).sort({score: {$meta: "textScore"}}).lean().exec()
    return results
}

module.exports = {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishedForShop,
    unPublishProductByShop,
    searchProducts
}