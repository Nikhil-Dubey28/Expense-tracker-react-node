const express = require('express')
const userController = require('../controller/userController')
const router = express.Router()
const authenticate = require('../middleware/authenticate')


//signup
router.post('/users/signup', userController.createUser)



//login
router.post('/users/login',userController.login)



module.exports = router