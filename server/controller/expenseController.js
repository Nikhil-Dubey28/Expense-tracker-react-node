const Expense = require('../model/Expense')



const createExpense = async(req,res) => {
    try {
        const {amount,description,category} = req.body  

        const newExpense = await Expense.create({amount,description,category})
        res.status(201).json(newExpense)
     }catch(err) {
        console.log(err)
        res.status(500).json({message:'internal server error'})
     }
}

const getExpense = async(req,res) => {
    try {
        const expenses = await Expense.findAll()
        res.status(200).json(expenses)
    } catch (err) {
        console.log(err)
        res.status(500).json({message: 'internal server error'})
    }
}


module.exports = {
    createExpense,getExpense
}