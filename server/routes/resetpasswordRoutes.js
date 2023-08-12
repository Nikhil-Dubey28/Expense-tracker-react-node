const express = require('express')
const resetpasswordController = require('../controller/resetpassController')
const router = express.Router()

router.use('/password/forgotpassword', resetpasswordController.forgotPassword)



module.exports =  router