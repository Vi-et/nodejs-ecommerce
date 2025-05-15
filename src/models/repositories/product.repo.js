'use strict'

const {product, clothing, electronic, furniture} = require('../product.model')
const {getSelectData, getUnSelectData} = require('../../utils')
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

const findAllProducts = async({limit, sort, page, filter, select}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === "ctime" ? {_id: -1} : {_id: 1}
    const products = await product
        .find(filter)
        .select(getSelectData(select))
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
    
    return products
}

const findProduct = async (productId, unSelect) => {
    return await product.findById(productId).select(getUnSelectData(unSelect)).lean().exec()
}

const updateProductById = async ({productId, data, model, isNew=true}) => {
    const updateProduct = await model.findByIdAndUpdate(productId, data, {
        new: isNew,
    })
    return updateProduct
}

module.exports = {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishedForShop,
    unPublishProductByShop,
    searchProducts,
    findAllProducts,
    findProduct,
    updateProductById
}