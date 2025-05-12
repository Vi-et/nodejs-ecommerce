'use strict'
const {findByKey} = require('../services/apiKey.service')

const HEADER = {
    API_KEY : 'x-api-key',
    AUTHORIZATION : 'authorization',
}

const apiKey = async (req, res, next) => {
    try {
       const key = req.headers[HEADER.API_KEY]?.toString()
       if (!key) {
           return res.status(401).json({ message: 'API key is missing' })
       }

       const objKey = await findByKey(key)
       if (!objKey) {
           return res.status(401).json({ message: 'Invalid API key' })
       }

       req.objKey = objKey

       return next()

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const permission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions.includes(permission)) {
            return res.status(403).json({ message: 'Forbidden' })
        }
        return next()
    }
}

const asyncHandler = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}

module.exports = {
    apiKey,
    permission,
    asyncHandler
}