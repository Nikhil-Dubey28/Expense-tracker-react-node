const Sequelize = require('sequelize');

const sequelize = new Sequelize('user', 'root', 'Fifa#2255', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
