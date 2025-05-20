'use strict'

const {cart} = require('../models/cart.model')
const { BadRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response')
const {CartConstants} = require('../constants')
const {getProductById} = require("../models/repositories/product.repo")
const {ProductValidatorBuilder} = require("../validation/product.validation")
const {convertStringToObjectId} = require("../utils")

class CartService{

    static async createCart({userId, products}) {
        const query = {
            userId,
            state: CartConstants.CART_STATES.ACTIVE
        }  
        const updateOrInsert = {
            $addToSet: {products},
        }, options = {
            upsert: true,
            new: true,
        }

        return await cart.findOneAndUpdate(query, updateOrInsert, options)
    }

    static async updateUserCartQuantity({userId, products}) {
        const {productId, quantity} = products
        const query = {userId, 'products.productId': productId, state: CartConstants.CART_STATES.ACTIVE},
        updateSet = {
            $inc:{
                'products.$.quantity': quantity                                                         
            }
        }, options = {
            new: true,
        }

        return await cart.findOneAndUpdate(query, updateSet, options)
    }

    static async addToCart({userId, product = {}}) {
        //Chưa có cart thì tạo mới
        const userCart = await cart.findOne({userId})

        const {productId, shopId} = product
        const foundProduct = await getProductById(productId)
        const productValidatorResult = new ProductValidatorBuilder(foundProduct)
            .validateProductExists()
            .validateProductBelongsToShop(shopId)
            .validateIsPublished()
            .build()
        if(!productValidatorResult.isValid) {
            throw new BadRequestError(productValidatorResult.errors[0])}

        const productToCreate = {
            productId: foundProduct._id,
            quantity: product.quantity,
            productName: foundProduct.product_name,
            shopId: foundProduct.product_shop,
        }

        if(!userCart){
            return await CartService.createCart({userId, products :productToCreate})
        }

        //Nếu có cart mà chưa có sản phẩm nào thì thêm sản phẩm vào
        if(!userCart.products.length){
            userCart.products = productToCreate
            return await userCart.save()
        }
        
        //Nếu có cart mà đã có sản phẩm này thì update quanity
        if(userCart.products.some(item => item.productId.toString() === productToCreate.productId.toString())){
            return await CartService.updateUserCartQuantity({userId, products : productToCreate})
        }
        //  Nếu cart đã có sản phẩm mà không phải sản phẩm này thì insert
        return await CartService.insertProductToCart({userId, product : productToCreate})

    }

    static async insertProductToCart({userId, product = {}}) {
        const query = {userId, state: CartConstants.CART_STATES.ACTIVE}
        const updateSet = {
            $addToSet: {
                products: product
            }
        }, options = {
            new: true,
        }
        return await cart.findOneAndUpdate(query, updateSet, options)
    }

    static async addToCartV2({userId, shopOrderIds = []}) {
            // Process each shop's orders in parallel
            const results = await Promise.all(shopOrderIds.map(async (shopOrder) => {
                const {shopId, products} = shopOrder;
                
                // Process each product for this shop in parallel
                const productResults = await Promise.all(products.map(async (product) => {
                    // Find and validate the product
                    const foundProduct = await getProductById(product.productId);
                    
                    const productValidatorResult = new ProductValidatorBuilder(foundProduct)
                        .validateProductExists()
                        .validateProductBelongsToShop(shopId)
                        .validateIsPublished()
                        .build();

                    if(!productValidatorResult.isValid) {
                        throw new BadRequestError(productValidatorResult.errors[0]);
                    }

                    const productToUpdate = {
                        productId: foundProduct._id,
                        quantity: product.quantity - product.oldQuantity,
                    };
                    
                    // If quantity becomes zero, remove from cart
                    if (product.quantity === 0) {
                        return await CartService.deleteUserCart({
                            userId, 
                            productId: productToUpdate.productId
                        });
                    }
                    
                    // Otherwise update the quantity
                    return await CartService.updateUserCartQuantity({
                        userId, 
                        products: productToUpdate
                    });
                }));
                
                return {
                    shopId,
                    productResults
                };
            }));
            
            // Return the final cart
            return await CartService.getListUserCart({userId});
    }

    static async deleteUserCart({userId, productId}) {

        const query = {userId, state: CartConstants.CART_STATES.ACTIVE};
        const updateSet = {
            $pull: {
                products: { productId: convertStringToObjectId(productId) }
            }
        };
        const options = {
            new: true
        };
        
        return await cart.findOneAndUpdate(query, updateSet, options);
    }

    static async getListUserCart({userId}) {
        return await cart.findOne({userId}).populate('products.productId', 'product_name product_price product_quantity product_type product_shop').lean().exec()
    }
}

module.exports = CartService