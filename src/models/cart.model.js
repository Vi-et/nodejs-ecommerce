'use strict'

const {model, Schema} = require('mongoose')
const {CartConstants} = require('../constants')

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'

const cartSchema = new Schema({
    state : {
        type: String,
        enum: [CartConstants.CART_STATES.ACTIVE, 
            CartConstants.CART_STATES.COMPLETED,
            CartConstants.CART_STATES.FAILED,
            CartConstants.CART_STATES.PENDING],
        default: CartConstants.CART_STATES.ACTIVE,
        required: true
    },
    products: {
        type: Array,
        required: true,
        default: []
    },
    countProducts:{
        type: Number,
        default: 0
    },
    userId : {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    }
},{
    collection: COLLECTION_NAME,
    timestamps: true
})

module.exports = {
    cart : model(DOCUMENT_NAME, cartSchema),
}