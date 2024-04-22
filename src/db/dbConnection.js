const Sequelize = require('sequelize');

const sequelizeInstance = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite3'
});

module.exports = { sequelizeInstance, Sequelize }
