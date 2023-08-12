const uuid = require('uuid')
const Sib = require('sib-api-v3-sdk')

const User =require('../model/User')

const Forgotpassword = require('../model/Forgotpassword')
const config = require('dotenv').config
config({path:'./config/config.env'})



const forgotPassword = async (req,res) => {
    try {
    const {email} = req.body

    const user = await User.findOne({where : { email }});
    if(user){
        const id = uuid.v4();
        user.createForgotpassword({ id , active: true })
            .catch(err => {
                throw new Error(err)
            })
            const client = Sib.ApiClient.instance 
            const apiKey = client.authentications['api-key']
            apiKey.apiKey = process.env.SIB_API_KEY

            const tranEmailApi = new Sib.TransactionalEmailsApi()

            const sender = {
                email: 'justmailnikhil3@gmail.com'
            }
            const receivers = [
                {
                    email: email
                }
            ]
        tranEmailApi.sendTransacEmail( {
                sender,
                to: receivers,
                subject: 'Sending with brevo is Fun',
                htmlContent: `<a href="http://localhost:3000/api/password/resetpassword/${id}">Reset password</a>`,
            })
            .then((response) => {
                console.log(response)
                return res.status(202).json({message: 'Link to reset password sent to your mail ', success: true})

            }).catch((err) =>{
                console.log(err)
            })
        }else{
            throw new Error('User does not exist')
        }
    }catch(err) {
        console.error(err)
        return res.json({ message: err, sucess: false });
    }
}


module.exports = {
    forgotPassword
}