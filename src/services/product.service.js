"use strict"

const {product, clothing, electronic, furniture} = require('../models/product.model')
const { BadRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response')

class ProductFactory{

    static productRegistry = {
    }
    static registerProductType(productType, productClass){
        if(!productType || !productClass) throw new BadRequestError('Product type or product class is not valid')
        if(this.productRegistry[productType]) throw new BadRequestError('Product type already exists')

        this.productRegistry[productType] = productClass
    }

    static async createProduct(productType,payload){
        const productCLass = this.productRegistry[productType]
        if(!productCLass) throw new BadRequestError('Product type not found')
        const newProduct = await new productCLass(payload).createProduct()
        return newProduct
    }
}

class Product{
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes
    }){
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    async createProduct(productId){
        return await product.create({...this, _id: productId})
    }
}

class Clothing extends Product{

    async createProduct(){
        const newClothing = await clothing.create({...this.product_attributes, product_shop: this.product_shop})
        if(!newClothing) throw new BadRequestError('Create new clothing failed')

        const newProduct = await super.createProduct(newClothing._id)
        if(!newProduct) throw new BadRequestError('Create new Product failed')

        return newProduct
    }
}

class Electronic extends Product{

    async createProduct(){
        const newElectronic = await electronic.create({...this.product_attributes, product_shop: this.product_shop})
        if(!newElectronic) throw new BadRequestError('Create new clothing failed')

        const newProduct = await super.createProduct(newElectronic._id)
        if(!newProduct) throw new BadRequestError('Create new Product failed')

        return newProduct
    }
}

class Furniture extends Product{
    async createProduct(){
        const newFurniture = await furniture.create({...this.product_attributes, product_shop: this.product_shop})
        if(!newFurniture) throw new BadRequestError('Create new clothing failed')

        const newProduct = await super.createProduct(newFurniture._id)
        if(!newProduct) throw new BadRequestError('Create new Product failed')

        return newProduct
    }
}

ProductFactory.registerProductType('clothing', Clothing)
ProductFactory.registerProductType('electronic', Electronic)
ProductFactory.registerProductType('furniture', Furniture)

module.exports = ProductFactory


