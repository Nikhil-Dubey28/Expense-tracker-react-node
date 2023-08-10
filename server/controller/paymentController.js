const Razorpay = require('razorpay');
const config = require('dotenv').config
const crypto = require('crypto')
const Order = require('../model/Order')
const User = require('../model/User')
const userController = require('./userController')
const jwt = require('jsonwebtoken');
const secretKey = 'default_secret_key_that_you_know_about';

config({ path: './config/config.env' })






const checkout = async (req, res) => {

    

    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_API_KEY,
            key_secret: process.env.RAZORPAY_API_SECRET,
        });
        const options = {
            amount: 5000,  // amount in the smallest currency unit
            currency: 'INR',
        };
        const order = await razorpay.orders.create(options);

        const newOrder = await Order.create({
            orderid: order.id,
            status: 'PENDING',
            userId: req.userId
        })

        res.status(200).json({
            success: true,
            order,
            newOrder,
            key_id : razorpay.key_id
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create Razorpay order',
        });
    }
};


   



const updatePayment = async(req,res) => {
    try{
    
        console.log(req.body)
    const { order_id, payment_id, signature_id } = req.body


    
    const order = await Order.findOne({where: {orderid:order_id }})

    
    if(order){
        await Order.update({status:'SUCCESS',paymentid:payment_id,signatureid:signature_id},
        { where: { orderid: order_id } } // Specify the where condition
        )
        
        const user = await User.findOne({ where: { id: order.userId } });
        if (user) {
            const userId = req.userId
            await user.update({ ispremiumuser: true });
            // const newToken = jwt.sign({ user: user }, secretKey, { expiresIn: '1h' });
            // res.status(200).json({newToken: newToken,user})
            res.status(200).json({
                success:'true',
                message: 'payment successful',
               token: userController.generateAccessToken(userId, user.name,true)
            })
        }
    }
    }
   
catch(err) {
    console.log(err)
    res.status(500).json({message:'internal server error'})
}
}



module.exports = {
    checkout,
    // paymentVerification,
    updatePayment
};
