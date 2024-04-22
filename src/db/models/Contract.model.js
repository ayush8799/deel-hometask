const { sequelizeInstance, Sequelize } = require('../dbConnection');

class Contract extends Sequelize.Model {}
Contract.init(
  {
    terms: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    status:{
      type: Sequelize.ENUM('new','in_progress','terminated')
    }
  },
  {
    sequelize: sequelizeInstance,
    modelName: 'Contract'
  }
);

module.exports = {
  Contract
}

