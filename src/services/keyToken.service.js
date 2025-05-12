'use strict'

const keyTokenModel = require("../models/keyToken.model")

class KeyTokenService{
    static createKeyToken = async ({userId, publicKey, privateKey, refreshToken = null}) => {
        try {

            // const tokens = await keyTokenModel.create({
            //     user: userId,
            //     publicKey: publicKeyString,
            //     privateKey: privateKey,
            // })
            const filter = { user: userId }
            const update = {
                publicKey: publicKey,
                privateKey: privateKey,
                refreshTokenUsed : [],
                refreshToken
            }
            const options = {
                new: true,
                upsert: true,
            }
            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)
            return tokens ? publicKeyString : null
        } catch (error) {
            return error
        }
    }

    static findByUserId = async (userId) => {
            return await keyTokenModel.findOne({ user: userId }).lean()
    }

    static removeKeyTokenById = async (id) => {
        return await keyTokenModel.findByIdAndDelete(id).lean()
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean()
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshToken })
    }

    static removeKeyTokenByUserId = async (userId) => {
        return await keyTokenModel.deleteMany({ user: userId }).lean();
    }

    static updateNewestToken = async (id, refreshToken, refreshTokenUsed) => {
        const keyInstance = await keyTokenModel.findById(id)
        keyInstance.refreshToken = refreshToken
        keyInstance.refreshTokensUsed.push(refreshTokenUsed)
        await keyInstance.save()
    }

}

module.exports =  KeyTokenService