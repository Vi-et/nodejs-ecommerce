'use strict'

const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const keyTokenService = require('./keyToken.service')
const { createTokenPair,  verifyJWT } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const { BadRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response')
const { findByEmail } = require('./user.service')

const RoleShop = {
    SHOP : 'SHOP',
    WRITER : 'WRITER',
    ADMIN : 'ADMIN',
    EDITOR : 'EDITOR',
}

class AccessService {
    
    static handleRefreshToken = async (refreshToken) => {
        console.log('Refresh token:', refreshToken)
        // Check xem có token nào đã trong danh sách refreshTokenUsed hay không
        const foundRefreshTokenUsed = await keyTokenService.findByRefreshTokenUsed(refreshToken)
        if(foundRefreshTokenUsed){
            const  {userId, email} = await verifyJWT(refreshToken, foundRefreshTokenUsed.privateKey)
            await keyTokenService.removeKeyTokenByUserId(userId)
            throw new ForbiddenError('Some thing went wrong !! Please login again')
        }

        // Check xem token có tồn tại hay không
        const holderToken = await keyTokenService.findByRefreshToken(refreshToken)
        console.log('Holder token:', holderToken)
        if (!holderToken) {
            throw new AuthFailureError('User not found')
        }

        // Check xem token có hợp lệ hay không
        const {userId, email} = await verifyJWT(refreshToken, holderToken.privateKey)
        const foundUser = await findByEmail(email)
        if (!foundUser) {
            throw new AuthFailureError('User not found')
        }

        // create new token pair
        const tokens = await createTokenPair({
            userId: foundUser._id,
            email: foundUser.email,
        }, holderToken.publicKey, holderToken.privateKey)

        keyTokenService.updateNewestToken(holderToken._id, tokens.refreshToken, refreshToken)

        return {
            shop: getInfoData({fields : ['_id', 'name', 'email', 'roles'], object : foundUser}),
            tokens
        }

    }

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