'use strict'

const JWT = require('jsonwebtoken')
const {asyncHandler} = require('../helpers/asyncHandler')
const { AuthFailureError } = require('../core/error.response')
const {findByUserId} = require('../services/keyToken.service')

const HEADER = {
    API_KEY : 'x-api-key',
    AUTHORIZATION : 'authorization',
    CLIENT_ID : 'x-client-id',
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = JWT.sign(payload, publicKey, {
            expiresIn: '2 days',
        })

        const refreshToken = JWT.sign(payload, privateKey, {
            expiresIn: '7 days',
        })

        JWT.verify(accessToken, publicKey, (err, decoded) => {
            if (err) {
                throw new Error('Invalid access token')
            }else {
                console.log('Access token decoded:', decoded)
            }
        })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new Error('Error creating token pair')
    }
}

const authentication = asyncHandler(async (req, res, next) => {
        const userId = req.headers[HEADER.CLIENT_ID]
        if(!userId){
            throw new AuthFailureError('Auth error')
        }

        const keyStore = await findByUserId(userId)
        if (!keyStore) {
            throw new AuthFailureError('Key token not found')
        }

        const accessToken = req.headers[HEADER.AUTHORIZATION]
        if (!accessToken) {
            throw new AuthFailureError('Access token not found')
        }

        try{
            const decodedUser = JWT.verify(accessToken, keyStore.publicKey)
            if (userId !== decodedUser.userId) {
                throw new AuthFailureError('Invalid access token')
            }
            req.keyStore = keyStore
            return next()
        }catch (error) {
            throw error
            }    
        }
)

module.exports = {
    createTokenPair,
    authentication
}