'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const router = express.Router()
const {asyncHandler} = require('../../auth/checkAuth')
const { authentication } = require('../../auth/authUtils')

router.post('/signup', asyncHandler(accessController.signUp))
router.post('/login', asyncHandler(accessController.logIn))

router.use(authentication)
router.post('/logout', asyncHandler(accessController.logOut))
router.post('/refresh-token', asyncHandler(accessController.handleRefreshToken))
module.exports = router