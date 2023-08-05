const express = require('express')
const expenseController = require('../controller/expenseController')
const router = express.Router()


// add expense
router.post('/expense/addexpense', expenseController.createExpense)

//get expense
router.get('/expense/getexpense',expenseController.getExpense)



module.exports = router