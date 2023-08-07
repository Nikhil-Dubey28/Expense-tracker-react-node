const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const User = require('./model/User')
const Expense = require ('./model/Expense')
const userRoutes = require('./routes/userRoutes')
const expenseRoutes = require('./routes/expenseRoutes')
const sequelize = require('./database/configDatabase')



const app = express()

const PORT = 3000
// middlewares
app.use(cors())
app.use(bodyParser.json())

// route 
app.use('/api', userRoutes )
app.use('/api', expenseRoutes)


User.hasMany(Expense, { foreignKey: 'userId' });
Expense.belongsTo(User, { foreignKey: 'userId' });

sequelize
.sync({force:true})
.then(() => {
    console.log('connected to the database')
    app.listen(PORT,() => {
        console.log(`server is running on http://localhost:${PORT}`)
    })
})
.catch((err) => console.log('error connecting to database:', err))