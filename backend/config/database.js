const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'new_database.sqlite'
});

module.exports = sequelize;