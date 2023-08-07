const express = require('express')
const authenticate = require('../middleware/authenticate')
const expenseController = require('../controller/expenseController')
const router = express.Router()

router.use(authenticate)

// add expense
router.post('/expense/addexpense', expenseController.createExpense)

//get expense
router.get('/expense/getexpense', expenseController.getExpense)

//delete expense
router.delete('/expense/:id',expenseController.deleteExpense)


module.exports = router