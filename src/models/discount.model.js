'use strict'

const {model, Schema} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'discounts'

const discountSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    type:{
        type:String,
        enum: ['percentage', 'fixed_amount'],
        default: 'fixed_amount',
    },
    value:{
        type:Number,
        required:true
    },
    maxValue:{
        type:Number,
        default: 0,
    },
    code:{
        type:String,
        required:true,
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    },
    maxUses:{
        type:Number,
        required: true
    },
    usesCount:{
        type:Number,
        required: true
    },
    usersUsed:{
        type: Array,
        default: [],
    },
    maxUsesPerUser:{
        type:Number,
        required: true
    },
    minOrderValue:{
        type:Number,
        required: true
    },
    shopId:{
        type: Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    isActive:{
        type:Boolean,
        default: true,
    },
    appliesTo:{
        type: String,
        enum: ['all', 'specific'],
    },
    productIds:{
        type: Array,
        default: [],
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});

module.exports = {
    discount : model(DOCUMENT_NAME, discountSchema),
}