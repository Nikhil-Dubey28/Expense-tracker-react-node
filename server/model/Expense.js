const Sequelize = require('sequelize')
const sequelize = require('../database/configDatabase')
const User = require('./User')


const Expense = sequelize.define('expense',{
    id : {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    date:{
        type: Sequelize.STRING,
        
    },
    amount : {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    category: {
        type: Sequelize.STRING,
    allowNull: false,
    },
    
})

// // Define association with User model
// Expense.belongsTo(User, { foreignKey: 'userId' });

module.exports = Expense
