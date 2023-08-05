const express = require('express')
const userController = require('../controller/userController')
const router = express.Router()


//signup
router.post('/users/signup', userController.createUser)

//login
router.post('/users/login',userController.login)



module.exports = router