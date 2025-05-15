'use strict'

const {BadRequestError} = require('../core/error.response')
const {discount} = require('../models/discount.model')
const {removeUndefinedObject} = require('../utils/index')
const {findAllProducts} = require('../models/repositories/product.repo')
const { product } = require('../models/product.model')
const { findAllDiscountCodesUnselect } = require('../models/repositories/discount.repo')

class DiscountService {

    static async createDiscount(payload){
        const {name, description, type, value, code, startDate, endDate, maxUses, usesCount, 
            usersUsed, maxUsesPerUser, minOrderValue, shopId, isActive, appliesTo,productIds
} = payload

        if( new Date() < new Date(startDate) || new Date() > new Date(endDate)){
            throw new BadRequestError('Discount start date must be in the future')
        }

        if( new Date(startDate) > new Date(endDate)){
            throw new BadRequestError('Discount start date must be before end date')
        }

        const foundDiscount = await discount.findOne({code: code, shopId: shopId}).lean().exec()

        if(foundDiscount.isActive && foundDiscount) throw new BadRequestError('Discount code already exists')
        
        const newDiscount = await discount.create({
            name, description, code, type, value,
            minOrderValue: minOrderValue || 0,
            maxValue, startDate: new Date(startDate), endDate: new Date(endDate),
            maxUses, usesCount, usersUsed, shopId, maxUsesPerUser, isActive, appliesTo,
            productIds: appliesTo === 'all' ? [] : productIds,
        })
        return newDiscount
        
    }

    static async updateDiscount(discountId, payload) {
        const cleanedPayload = removeUndefinedObject(payload)
        const updatedDiscount = await discount.findByIdAndUpdate(discountId, cleanedPayload, {
            new: true,
            runValidators: true,
        }).lean().exec()
        return updatedDiscount
        
    }

    static async getAllDiscountCodesWithProduct({code, shopId, userId, limit, page}){
        const foundDiscount = await discount.findOne({discount_code: code, discount_shopId: shopId}).lean().exec()
    
        if(!foundDiscount || foundDiscount.isActive === false) {
            throw new BadRequestError('Discount code not found or inactive')
        }

        const {appliesTo, productIds} = foundDiscount
        if(appliesTo === 'all') {
            const products = await findAllProducts({
                filter: {
                    product_shop: shopId,
                    isDraft: false,
                    isPublished: true,
                },
                limit: +limit || 10,
                page: +page || 1,
                sort: 'ctime',
                select: ["product_name"]
            })
        }

        if(appliesTo === 'specific') {
            const products = await findAllProducts({
                filter: {
                    _id: { $in: productIds },
                    isDraft: false,
                    isPublished: true,
                },
                limit: +limit || 10,
                page: +page || 1,
                sort: 'ctime',
                select: ["product_name"]
            })
        }
        return products
    }

    static async getAllDiscountCodesByShop({shopId, limit, page}){
        return await findAllDiscountCodesUnselect({
            filter: {
                shopId: shopId,
                isActive: true
            },
            limit: +limit || 10,
            page: +page || 1,
            sort: 'ctime',
            unSelect: ['__v', 'shopId'],
            model: discount
        })
    }
}