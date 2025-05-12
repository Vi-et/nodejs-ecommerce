'use strict'

const mongoose = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'
// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    product_name:{
        type:String,
        required:true
    },

    product_thumb:{
        type:String,
        required:true
    },

    product_description:{
        type:String
    },

    product_price:{
        type:Number,
        required:true
    },

    product_quantity:{
        type:Number,
        required:true
    },

    product_type:{
        type:String,
        required:true,
        enum: ['electronic', 'clothing', 'furniture']
    },

    product_shop:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop"
    },

    product_attributes:{
        type:mongoose.Schema.Types.Mixed,
        required:true
    },
},  {
    collection: COLLECTION_NAME,
    timestamps: true
})

// define the product type = clothing

const clothingSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: true
    },
    
    size: String,

    material: String,
    product_shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop"
    },
},{
    collection: 'clothes',
    timestamps: true
})

// define the product type = electronic

const electronicSchema = new mongoose.Schema({
    manufacturer: {
        type: String,
        required: true
    },    
    product_shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop"
    },
    
    model: String,

    color: String
},{
    collection: 'electronics',
    timestamps: true
})

const furnitureSchema = new mongoose.Schema({
    material: {
        type: String,
        required: true
    },
    
    product_shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop"
    },
    
    brand: {type: String},
    size: {type: String},

},{
    collection: 'furniture',
    timestamps: true
})

//Export the model
module.exports = {
    product : mongoose.model(DOCUMENT_NAME, productSchema),
    electronic: mongoose.model("Electronics", electronicSchema),
    clothing: mongoose.model("Clothing", clothingSchema),
    furniture: mongoose.model("Furniture", furnitureSchema)
}