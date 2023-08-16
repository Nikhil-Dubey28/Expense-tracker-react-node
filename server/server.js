const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const User = require('./model/User')
const Expense = require ('./model/Expense')
const Order = require('./model/Order')
const Forgotpassword = require('./model/Forgotpassword')
const userRoutes = require('./routes/userRoutes')
const expenseRoutes = require('./routes/expenseRoutes')
const paymentRoutes = require('./routes/paymentRoutes.js')
const resetpasswordRoutes = require('./routes/resetpasswordRoutes')
const sequelize = require('./database/configDatabase')
const Sib = require('sib-api-v3-sdk')
const helmet = require('helmet')
const path = require('path')
const fs = require('fs')
const morgan = require('morgan')

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


const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'})

// middlewares
app.use(helmet())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined' {stream: accessLogStream}),)

// route 
app.use('/api',resetpasswordRoutes)
app.get('/api/getkey',(req,res) => res.status(200).json({key: process.env.RAZORPAY_API_KEY}))
app.use('/api', userRoutes )
app.use('/api', paymentRoutes)
app.use('/api', expenseRoutes)
app.use('/api', premiumRoutes)


User.hasMany(Expense, { foreignKey: 'userId' });
Expense.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Order , { foreignKey: 'userId' })
Order.belongsTo(User, { foreignKey: 'userId' })

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);


sequelize
.sync()
.then(() => {
    console.log('connected to the database')
    app.listen(process.env.PORT,() => {
        console.log(`server is running on http://localhost:${process.env.PORT}`)
    })
})
.catch((err) => console.log('error connecting to database:', err))