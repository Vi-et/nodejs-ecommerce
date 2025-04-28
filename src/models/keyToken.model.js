'use strict';

const {model, Schema} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'KeyToken'
const COLLECTION_NAME = 'KeyTokens'

// Declare the Schema of the Mongo model
var keyTokenSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'Shop',
        required:true,
    },
    publicKey:{
        type:String,
        required:true,
    },
    privateKey:{
        type:String,
        required:true,
    },
    refreshTokensUsed:{
        type:Array,
        default: [],
    },
    refreshToken:{
        type:String,
        required: true,
    },
},
{
    timestamps:true,
    collection: COLLECTION_NAME,
});

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);