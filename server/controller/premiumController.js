const User = require('../model/User')
const Expense = require('../model/Expense')
const sequelize = require('../database/configDatabase')
const { Op } = require("sequelize");





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
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        const startIndex = (page-1)*limit
        const lastIndex = (page)*limit

        const results ={}
        results.totalUsers = leaderboardofusers.length;

        results.pageCount =Math.ceil(leaderboardofusers.length/limit)

        if(lastIndex<leaderboardofusers.length){
            results.next= {
                page:page + 1,
                
            }
        }
        if(startIndex > 0){

            results.prev={
                page: page -1,
            }
        }

        results.result = leaderboardofusers.slice(startIndex,lastIndex)
        
        res.status(200).json(results)
    }catch(err) {
        console.log(err)
res.status(500).json({message: 'internal server error'})

    }
} 


const dailyReports = async (req,res) => {
    try {
        const {date} = req.body
        // Convert the date from 'dd-mm-yyyy' to 'yyyy-mm-dd' format
        const [day, month, year] = date.split('-');
        const formattedDate = `${year}-${month}-${day}`;

        const expenses = await Expense.findAll({where: {date:formattedDate,userId:req.userId}})
        
        res.status(200).json(expenses)
    }catch(err) {
        console.log(err)
        res.status(500).json({message: 'internal server error'})
    }

}

const monthlyReports = async (req,res) => {
    try { 
        const formattedMonth = req.body.month;
console.log("Formatted Month:", formattedMonth);
       
        const expenses = await Expense.findAll({where:   {
            date: {
                [Op.like]:`%-${formattedMonth}-%`,
            },
            userId: req.userId
        },
    raw :true,})

    res.status(200).json(expenses)
    }catch(err) {
        console.log(err)
        res.status(500).json({message: 'internal server error'})
    }
}














module.exports = {
    getLeaderboard,
    dailyReports,
    monthlyReports
}