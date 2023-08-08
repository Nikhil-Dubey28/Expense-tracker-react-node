const Expense = require('../model/Expense')




const createExpense = async(req,res) => {
    try {
        const {amount,description,category} = req.body  

        const newExpense = await Expense.create({amount,description,category, userId: req.userId})
        res.status(201).json(newExpense)
     }catch(err) {
        console.log(err)
        res.status(500).json({message:'internal server error'})
     }
}

const getExpense = async(req,res) => {
    try {
        const expenses = await Expense.findAll({where: {userId: req.userId}})
        res.status(200).json(expenses)
    } catch (err) {
        console.log(err)
        res.status(500).json({message: 'internal server error'})
    }
}

const deleteExpense = async(req,res) => {
    try {
        const {id} =req.params
        await Expense.destroy({where : {id,userId:req.userId}})
        res.status(204).end()
    }catch(err){
        console.log(err)
        res.status(500).json({message: 'internal server error'})
    }
}

module.exports = {
    createExpense,
    getExpense,
    deleteExpense
}


 