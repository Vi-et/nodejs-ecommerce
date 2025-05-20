'use strict'

const {BadRequestError} = require('../core/error.response')
const {discount} = require('../models/discount.model')
const {removeUndefinedObject} = require('../utils/index')
const {findAllProducts} = require('../models/repositories/product.repo')
const { findAllDiscountCodesUnselect, checkDiscountExists } = require('../models/repositories/discount.repo')
const {DiscountValidatorBuilder, NewDiscountValidatorBuilder} = require("../validation/discount.validation")
class DiscountService {

    static async createDiscount(payload){
        const {name, description, type, value, code, startDate, endDate, maxUses, usesCount, 
            usersUsed, maxUsesPerUser, minOrderValue, shopId, isActive, appliesTo,productIds, maxValue
} = payload

        const validator = new NewDiscountValidatorBuilder(payload)
            .validateDates()
            .validatePercentageValue()
            .validateAppliesTo()
        await validator.validateExisted(code, shopId)
        const validationResult = validator.build()

        if(!validationResult.isValid) {
            throw new BadRequestError(validationResult.errors[0])
        }
        
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

    static async getAllDiscountCodesWithProduct({code, shopId, limit, page}){
        const foundDiscount = await discount.findOne({code, shopId}).lean().exec()
    
        const validationResult = new DiscountValidatorBuilder(foundDiscount)
            .validateDiscountExists()
            .validateActive()
            .build()
        if(!validationResult.isValid) {
            throw new BadRequestError(validationResult.errors[0])
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

            return products
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

            return products
        }
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

    static async getDiscountAmount({code, shopId, userId, products}){
        const foundDiscount = await checkDiscountExists({filter: {code: code, shopId: shopId}, model: discount})

        let totalOrderValue = products.reduce((acc, product) => {
            return acc + product.quantity * product.price
        }, 0)
        const validationResult = new DiscountValidatorBuilder(foundDiscount)
            .validateDiscountExists()
            .validateActive()
            .validateStartDate()
            .validateEndDate()
            .validateMaxUses()
            .validateMinOrderValue(totalOrderValue)
            .validateUserUsage(userId)
            .build()

        if(!validationResult.isValid) {
            throw new BadRequestError(validationResult.errors[0])
        }

        const amount = foundDiscount.type === "fixed_amount" ? foundDiscount.value : (totalOrderValue * foundDiscount.value) / 100
        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrderValue - amount,
        }
    }

    static async deleteDiscountCode({shopId, code}){
        const deleteDiscountCode = await discount.findOneAndDelete({
            code,
            shopId,
        }).lean().exec()

        return deleteDiscountCode
    }

    static async cancelDiscountCode({shopId, code, userId}){
        const foundDiscount = await checkDiscountExists({filter: {code: code, shopId: shopId}, model: discount})
        
        const validationResult = new DiscountValidatorBuilder(foundDiscount)
            .validateDiscountExists()
        
        if(!validationResult.isValid) {
            throw new BadRequestError(validationResult.errors[0])
        }

        const result = await discount.findByIdAndUpdate(foundDiscount._id, {
            $pull:{
                usersUsed: userId,
            },
            $inc:{
                maxUses: 1,
                usesCount: -1,
            }
        }, {
            new: true,
        }).lean().exec()

        return result
    
    }
}

module.exports = DiscountService