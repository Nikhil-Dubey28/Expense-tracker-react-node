const User = require('../model/User')

// register/sign up 
const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        const existingUser = await User.findOne({ where: { email } })

        if (existingUser) {
            res.status(409).json({ message: 'User with this email already exists' })
        }

        const user = await User.create({ name, email, password })
        res.status(201).json(user)

    } catch (err) {
        console.error(err.message)
        console.error(err.stack)
        res.status(500).json({ message: 'internal server error' })
    }
}


//login 
const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const userDetails = await User.findOne({ where: { email } })

        if (!userDetails) {
            res.status(404).json('wrong email')
        } else {
            const correctPass = userDetails.password === password
            if (correctPass) {
                res.status(200).json('user login successful')
            } else {
                res.status(401).json('wrong password')
            }
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'internal server error' })
    }
}










module.exports = {
    createUser,
    login
}