const createUser = async(req,res) =>{
    try {
        const {name,email,password} = req.body

        const existingUser = await User.findOne({where: {email}})

        if(existingUser){
            res.status(409).json({message:'User with this email already exists'})
        }

        const user = await User.create({name,email,password})
        res.status(201).json(user)

    }catch(err) {
        console.error(err.message)
        console.error(err.stack)
        res.status(500).json({message: 'internal server error'})
    }
}

module.exports={
    createUser
}