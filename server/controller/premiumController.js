const User = require('../model/User')
const Expense = require('../model/Expense')
const sequelize = require('../database/configDatabase')





// const getLeaderboard = async(req,res) => {
//     try { 

//         const users = await User.findAll()
//         const expenses = await Expense.findAll()

//         let userAggExp = {}

//         expenses.forEach((expense) => {
//             if(userAggExp[expense.userId]){
//                 userAggExp[expense.userId] = userAggExp[expense.userId] + parseInt( expense.amount)
//             }else{
//                 userAggExp[expense.userId] = parseInt(expense.amount)
//             }

//         })

//         let userLeaderboardDetails = []

//         users.forEach((user) => {
//             userLeaderboardDetails.push({name:user.name, total_cost: userAggExp[user.id] || 0})

            
//         })
//         userLeaderboardDetails.sort((a,b) => b.total_cost - a.total_cost)
//         res.status(200).json(userLeaderboardDetails)
//     }catch(err) {
//         console.log(err)
// res.status(500).json({message: 'internal server error'})

//     }
// } 


const getLeaderboard = async(req,res) => {
    try { 

        const leaderboardofusers = await User.findAll({
            attributes: ['id','name', 'totalexpenses'],
            
        
            order: [['totalexpenses', 'DESC']]
        })
        
        res.status(200).json(leaderboardofusers)
    }catch(err) {
        console.log(err)
res.status(500).json({message: 'internal server error'})

    }
} 













module.exports = {
    getLeaderboard,
}