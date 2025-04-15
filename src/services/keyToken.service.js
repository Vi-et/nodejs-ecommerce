'use strict'

const keyTokenModel = require("../models/keyToken.model")

class KeyTokenService{
    static createKeyToken = async ({userId, publicKey, privateKey}) => {
        try {

            const tokens = await keyTokenModel.create({
                user: userId,
                publicKey: publicKeyString,
                privateKey: privateKey,
            })
            return tokens ? publicKeyString : null
        } catch (error) {
            return error
        }
    }
}

module.exports =  KeyTokenService