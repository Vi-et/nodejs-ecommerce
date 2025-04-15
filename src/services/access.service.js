'use strict'

const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const keyTokenService = require('./keyToken.service')
const { createTokenPair } = require('../auth/authUtils')
const { getInfoData } = require('../utils')

const RoleShop = {
    SHOP : 'SHOP',
    WRITER : 'WRITER',
    ADMIN : 'ADMIN',
    EDITOR : 'EDITOR',
}

class AccessService {
    static async signUp({name, email, password}) {
        try {
            // Logic for signing up a user
            const existedShop = await shopModel.findOne({ email }).lean()
            if (existedShop) {
                return { error: 'Email already exists' };
            }
            const hashedPassword = await bcrypt.hash(password, 10)
            const newShop = await shopModel.create({ name, email, password: hashedPassword, roles : [RoleShop.SHOP] });
            
            if (newShop) {

                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')


                const keyStore = await keyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey,
                })


                if (!keyStore) {
                    return { error: 'Error creating public key' };
                }


                const tokens = await createTokenPair({
                    userId: newShop._id,
                    email: newShop.email,
                }, publicKey, privateKey)

                return {
                    message: 'User signed up successfully',
                    metadata : {
                        shop: getInfoData({fields : ['_id', 'name', 'email', 'roles'], object : newShop}),
                        tokens
                    }
                };

            }


            return { message: 'User signed up successfully' };
        } catch (error) {
            console.error('Error signing up user:', error);
            return { error: 'Error signing up user' };
        }
    }
}

module.exports =  AccessService