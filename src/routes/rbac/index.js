'use strict'

const express = require('express')
const {newResource, newRole, listResources, listRoles} = require('../../controllers/rbac.controller')
const router = express.Router()
const {asyncHandler} = require('../../auth/checkAuth')
const { authentication } = require('../../auth/authUtils')

router.post('/resource', asyncHandler(newResource))
router.post('/role', asyncHandler(newRole))
router.get('/resources', asyncHandler(listResources))
router.get('/roles', asyncHandler(listRoles))

module.exports = router