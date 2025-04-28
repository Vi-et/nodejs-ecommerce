'use strict'

const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const keyTokenService = require('./keyToken.service')
const { createTokenPair } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const { BadRequestError, AuthFailureError } = require('../core/error.response')
const { findByEmail } = require('./user.service')

const RoleShop = {
    SHOP : 'SHOP',
    WRITER : 'WRITER',
    ADMIN : 'ADMIN',
    EDITOR : 'EDITOR',
}

class AccessService {

    static logOut = async (keyStore) => {
        return await keyTokenService.removeKeyTokenById(keyStore._id)
    }

    static async logIn({email, password, refreshToken = null}) {
        const foundShop = await findByEmail(email)

        if (!foundShop) {
            throw new BadRequestError('Shop not found')
        }
        const isMatch = await bcrypt.compare(password, foundShop.password)
        if (!isMatch) {
            throw new AuthFailureError('Auth error')
        }
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        const tokens = await createTokenPair({
            userId: foundShop._id,
            email: foundShop.email,
        }, publicKey, privateKey)

        await keyTokenService.createKeyToken({
            userId: foundShop._id,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken,
        })

        return {
            shop: getInfoData({fields : ['_id', 'name', 'email', 'roles'], object : foundShop}),
            tokens
        }
    }

    static async signUp({name, email, password}) {
 
            // Logic for signing up a user
            const existedShop = await shopModel.findOne({ email }).lean()
            if (existedShop) {
                throw new BadRequestError()    
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
                    throw new BadRequestError('Error creating key token')
                }


                const tokens = await createTokenPair({
                    userId: newShop._id,
                    email: newShop.email,
                }, publicKey, privateKey)

                return {
    
                        shop: getInfoData({fields : ['_id', 'name', 'email', 'roles'], object : newShop}),
                        tokens
                    
                };

            }


            return { message: 'User signed up successfully' };

    }
}

module.exports =  AccessService