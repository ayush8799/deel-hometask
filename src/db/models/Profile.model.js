
const { sequelizeInstance, Sequelize } = require('../dbConnection');

class Profile extends Sequelize.Model {}
Profile.init(
  {
    firstName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    profession: {
      type: Sequelize.STRING,
      allowNull: false
    },
    balance:{
      type:Sequelize.DECIMAL(12,2),      
      allowNull: false,
      defaultValue: 0.00,
    },
    type: {
      type: Sequelize.ENUM('client', 'contractor')
    }
  },
  {
    sequelize: sequelizeInstance,
    modelName: 'Profile'
  }
);

module.exports = {
  Profile
}

