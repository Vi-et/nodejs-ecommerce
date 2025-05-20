'use strict'

const mongoose = require('mongoose'); // Erase if already required
const { default: slugify } = require('slugify');
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
    product_ratingsAverage:{
        type:Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: val => Math.round(val * 10) / 10
    },

    product_slug:{
        type:String,
    },
    product_variations:{
        type:Array,
        default: []},
    isDraft:{
        type:Boolean,
        default: true,
        index: true
    },
    isPublished:{
        type:Boolean,
        default: false,
        index: true
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

productSchema.index({product_name: 'text', product_description: 'text'})

productSchema.pre('save', function(next) {
    this.product_slug = slugify(this.product_name, {lower: true})
    next();
})
// define the product type = clothing

const clothingSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: true
    },
    
    size: {
    type: String,
},

    material: {
        type: String,
    },
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