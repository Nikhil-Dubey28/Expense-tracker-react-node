const sequelize = require('../database/configDatabase')
const Expense = require('../model/Expense')
const User = require('../model/User')




const createExpense = async(req,res) => {

    const t = await sequelize.transaction()
    try {
        const {amount,description,category} = req.body  

        const newExpense = await Expense.create({amount,description,category, userId: req.userId},{t})


        const user = await User.findByPk(req.userId)

        const updateTotalExpense = user.totalexpenses + parseInt(amount)
        await user.update({totalexpenses: updateTotalExpense},{t})

      await  t.commit()
        res.status(201).json(newExpense)
     }catch(err) {
        await t.rollback()
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

        const deletedExpense = await Expense.findByPk(id)

        if (!deletedExpense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        const deletedAmount = deletedExpense.amount
        await Expense.destroy({where : {id,userId:req.userId}})

        const user = await User.findByPk(req.userId)

        const updatedTotalExpenses = user.totalexpenses - deletedAmount
        await user.update({totalexpenses : updatedTotalExpenses})
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


 