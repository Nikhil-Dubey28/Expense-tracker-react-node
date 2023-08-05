const Sequelize = require('sequelize')
const sequelize = require('../database/configDatabase')


const Expense = sequelize.define('expense',{
    id : {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
    }
})

module.exports = Expense
