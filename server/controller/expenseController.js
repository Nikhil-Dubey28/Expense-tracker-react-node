const sequelize = require('../database/configDatabase')
const Expense = require('../model/Expense')
const User = require('../model/User')




const createExpense = async(req,res) => {

    const t = await sequelize.transaction()
    try {
        const {amount,description,category,date} = req.body  

        const newExpense = await Expense.create({amount,description,category,date, userId: req.userId, order : [['date','DESC']]},{t})


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
        const expenses = await Expense.findAll({where: {userId: req.userId}}, {
            order: [['date','ASC']]
        })
        


        res.status(200).json(expenses)
    } catch (err) {
        console.log(err)
        res.status(500).json({message: 'internal server error'})
    }
}

const getExpenseById = async (req, res) => {
    try {
        const { id } = req.params;

        const expense = await Expense.findOne({ where: { id, userId: req.userId } });

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        res.status(200).json(expense);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const paginatedExpense = async(req,res) => {
    try {
        const expenses = await Expense.findAll({where: {userId: req.userId},
            order: [['date','DESC']]
         } )
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        const startIndex = (page-1)*limit
        const lastIndex = (page)*limit

        const results ={}
        results.totalExpenses = expenses.length;

        results.pageCount =Math.ceil(expenses.length/limit)

        if(lastIndex<expenses.length){
            results.next= {
                page:page + 1,
                
            }
        }
        if(startIndex > 0){

            results.prev={
                page: page -1,
            }
        }

        results.result = expenses.slice(startIndex,lastIndex)


        res.status(200).json(results)
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

const editExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, description, category,date } = req.body;
    
        const expense = await Expense.findOne({ where: { id } });
    
        if (!expense) {
          return res.status(404).json({ message: 'expense not found' });
        }

        
    
        await Expense.update(
            {
              category: category,
              description: description,
              amount: amount,
              date: date
            },
            { where: { id: id, userId: req.userId } }
          );

        //   await User.update(
        //     {
        //       totalexpenses: req.user.totalexpenses - expense.amount + Number(amount),
        //     },
        //     { where: { id: req.userId } }
        //   );
        const user = await User.findByPk(req.userId)
        const updatedTotalExpenses = user.totalexpenses - expense.amount + Number(amount)
        await user.update({totalexpenses: updatedTotalExpenses})
    
        res.status(200).json(expense);
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
      }
};

module.exports = {
    createExpense,
    getExpense,
    deleteExpense,
    paginatedExpense,
    editExpense,
    getExpenseById
}


 