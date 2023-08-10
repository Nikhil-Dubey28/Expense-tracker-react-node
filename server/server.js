const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const User = require('./model/User')
const Expense = require ('./model/Expense')
const Order = require('./model/Order')
const userRoutes = require('./routes/userRoutes')
const expenseRoutes = require('./routes/expenseRoutes')
const paymentRoutes = require('./routes/paymentRoutes.js')
const sequelize = require('./database/configDatabase')

const premiumRoutes = require('./routes/premiumRoutes')
const config = require('dotenv').config
const Razorpay = require('razorpay')

config({path:'./config/config.env'})

 const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
  });
  module.exports  = instance


const app = express()


// middlewares
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

// route 
app.get('/api/getkey',(req,res) => res.status(200).json({key: process.env.RAZORPAY_API_KEY}))
app.use('/api', userRoutes )
app.use('/api', paymentRoutes)
app.use('/api', expenseRoutes)
app.use('/api', premiumRoutes)


User.hasMany(Expense, { foreignKey: 'userId' });
Expense.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Order , { foreignKey: 'userId' })
Order.belongsTo(User, { foreignKey: 'userId' })




sequelize
.sync()
.then(() => {
    console.log('connected to the database')
    app.listen(process.env.PORT,() => {
        console.log(`server is running on http://localhost:${process.env.PORT}`)
    })
})
.catch((err) => console.log('error connecting to database:', err))