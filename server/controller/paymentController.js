const Razorpay = require('razorpay');
const config = require('dotenv').config
const crypto = require('crypto')
const Order = require('../model/Order')

config({ path: './config/config.env' })

// Assuming the Razorpay instance is exported from server.js
const instance = require('../server.js');

// Create a new Razorpay instance using the exported 'instance'
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
});

const checkout = async (req, res) => {
    const options = {
        amount: 5000,  // amount in the smallest currency unit
        currency: 'INR',
    };

    try {
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


const paymentVerification = async (req, res) => {
    console.log(req.body)


    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

    const body = razorpay_order_id + "|" + razorpay_payment_id

    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_API_SECRET)
        .update(body.toString())
        .digest('hex');
    console.log('sig received', razorpay_signature);
    console.log('sig generated', expectedSignature);


    const isAuthentic = expectedSignature === razorpay_signature

    if(isAuthentic){

        const order = await Order.findOne({where: {orderid:razorpay_order_id }})

        if(order){
            await Order.update({status:'SUCCESS',paymentid:razorpay_payment_id,signatureid:razorpay_signature},
            { where: { orderid: razorpay_order_id } } // Specify the where condition
            )
            res.redirect(`http://localhost:5173/paymentsuccess?reference=${razorpay_payment_id}`)
        }else{
            res.status(404).json({
                success: 'false',
                error: 'order not found',

            })
        }

    }else{
        res.status(400).json({
            success: false,
            error: 'invalid signature'
        });
    }





   


};

const updatePayment = async(req,res) => {

}



module.exports = {
    checkout,
    paymentVerification
};
