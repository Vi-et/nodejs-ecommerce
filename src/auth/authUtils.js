'use strict'

const JWT = require('jsonwebtoken')

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

module.exports = {
    createTokenPair,
}