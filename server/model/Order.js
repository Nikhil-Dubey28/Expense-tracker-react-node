const Sequelize = require('sequelize')
const sequelize = require('../database/configDatabase')
const User = require('./User')


const Order = sequelize.define('order',{
    id : {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    orderid : {
        type: Sequelize.STRING,
       
    },
    paymentid: {
        type: Sequelize.STRING,
    },
    signatureid : {
        type: Sequelize.STRING,
    },
    status: {
        type: Sequelize.STRING,
        
    },

   
    
})

// // Define association with User model
// Expense.belongsTo(User, { foreignKey: 'userId' });

module.exports = Order