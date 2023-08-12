const express = require('express')
const authenticate = require('../middleware/authenticate')
const expenseController = require('../controller/expenseController')
const router = express.Router()

// router.use(authenticate)

// add expense
router.post('/expense/addexpense', authenticate,expenseController.createExpense)

//get expense
router.get('/expense/getexpense',authenticate, expenseController.getExpense)

//delete expense
router.delete('/expense/:id',authenticate,expenseController.deleteExpense)


module.exports = router