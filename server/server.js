const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const User = require('./model/User')
const sequelize = require('./database/configDatabase')



const app = express()

const PORT = 3000
// middlewares
app.use(cors())
app.use(bodyParser.json())

// route 
app.post('/users/signup', async(req,res) =>{
    try {
        const {name,email,password} = req.body
        const user = await new User.create({name,email,password})

        res.status(201).json(user)
    }catch(err) {
        console.log('error')
        res.status(500).json({message: 'internal server error'})
    }
})


sequelize
.sync()
.then(() => {
    console.log('connected to the database')
    app.listen(PORT,() => {
        console.log(`server is running on http://localhost:${PORT}`)
    })
})
.catch((err) => console.log('error connecting to database:', err))