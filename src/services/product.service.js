"use strict"

const {product, clothing, electronic, furniture} = require('../models/product.model')
const { BadRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response')
const {findAllDraftsForShop, publishProductByShop, findAllPublishedForShop, unPublishProductByShop, searchProducts, findAllProducts, findProduct, updateProductById} = require('../models/repositories/product.repo')
const { insertInventory } = require('../models/repositories/inventory.repo')
class ProductFactory{

    static productRegistry = {
    }
    static registerProductType(productType, productClass){
        if(!productType || !productClass) throw new BadRequestError('Product type or product class is not valid')
        if(this.productRegistry[productType]) throw new BadRequestError('Product type already exists')

        this.productRegistry[productType] = productClass
    }
    //POST//
    static async createProduct(productType,payload){
        const productCLass = this.productRegistry[productType]
        if(!productCLass) throw new BadRequestError('Product type not found')
        const newProduct = await new productCLass(payload).createProduct()
        return newProduct
    }

    //END POST//

    //PUT//
    static async publishProductByShop(shopId, productId){
        if(!shopId || !productId) throw new BadRequestError('Shop id or product id is not valid')
        return await publishProductByShop(shopId, productId)
    
    }

    static async unPublishProductByShop(shopId, productId){
        if(!shopId || !productId) throw new BadRequestError('Shop id or product id is not valid')
        return await unPublishProductByShop(shopId, productId)
    }

    static async updateProduct(productType, productId, payload){
        const productClass = this.productRegistry[productType]
        if(!productClass) throw new BadRequestError('Product type not found')
        const updateProduct = await new productClass(payload).updateProduct(productId)
        return updateProduct
    }
    //END PUT//
    //GET//

    static async findAllDraftsForShop(shop, limit=50, skip=0){
        if(!shop) throw new BadRequestError('Shop id is not valid')
        
        return await findAllDraftsForShop({
            product_shop: shop,
            isDraft: true
        }, limit, skip);
    }

    static async findAllPublishedForShop(shop, limit=50, skip=0){
        if(!shop) throw new BadRequestError('Shop id is not valid')
        
        return await findAllPublishedForShop({
            product_shop: shop,
            isPublished: true
        }, limit, skip);
    }

    static async searchProducts({keySearch}){
        if(!keySearch) throw new BadRequestError('Key search is not valid')
        return await searchProducts(keySearch)
    }

    static async findAllProducts({limit = 50, sort = 'ctime', page = 1, filter = {isPublished:true  }}){
        return await findAllProducts({limit, sort, page, filter, select: ["product_name", "product_thumb", "product_price", "_id", "product_shop"]})
    }

    static async findProduct(productId){
        return await findProduct(productId, ["__v"])
    }

    //END GET//
    //DELETE//
    //END DELETE//
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
        const newProduct = await product.create({...this, _id: productId})
        if(newProduct){
            await insertInventory({
                productId: newProduct._id,
                shopId: this.product_shop,
                stock: this.product_quantity,
            })
        }
        return newProduct
    }

    async updateProduct(productId, payload){
        const updateProduct =  await updateProductById({productId, data:payload, model: product})
        return updateProduct
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

    async updateProduct(productId){
        const objParams = this
        if(objParams.product_attributes){
            
            await updateProductById({productId, data:objParams.product_attributes, model: clothing})
        }

        const updateProduct = await super.updateProduct(productId, {...objParams})
        return updateProduct
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

    async updateProduct(productId){
        const objParams = this
        if(objParams.product_attributes){
            
            await updateProductById({productId, data:objParams.product_attributes, model: electronic})
        }

        const updateProduct = await super.updateProduct(productId, {...objParams})
        return updateProduct
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

    async updateProduct(productId){
        const objParams = this
        if(objParams.product_attributes){
            
            await updateProductById({productId, data:objParams.product_attributes, model: furniture})
        }

        const updateProduct = await super.updateProduct(productId, {...objParams})
        return updateProduct
    }
}

ProductFactory.registerProductType('clothing', Clothing)
ProductFactory.registerProductType('electronic', Electronic)
ProductFactory.registerProductType('furniture', Furniture)

module.exports = ProductFactory


