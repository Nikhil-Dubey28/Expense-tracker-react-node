const express = require('express')
const userController = require('../controller/userController')
const router = express.Router()

router.post('/users/signup', userController.createUser)



module.exports = router