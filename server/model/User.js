const Sequelize = require('sequelize')
const sequelize = require('../database/configDatabase')
const Expense = require('./Expense')


const User = sequelize.define('user',{
    id : {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name : {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
    allowNull: false,
    },
    ispremiumuser: {
        type: Sequelize.BOOLEAN,
        allowNull:false
    },
})

// // Define association with Expense model
// User.hasMany(Expense, { foreignKey: 'userId' });

module.exports = User
