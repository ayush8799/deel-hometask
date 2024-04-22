const Joi = require('joi');
const depositBalanceServiceInstance = require("../services/depositBalance.service")

class DepositBalance {
  
  getValidationSchema() {
    const schema = Joi.object({
      profileId: Joi.number().integer().positive().required(),
      depositAmount: Joi.number().positive().required()
    });
    return schema;
  }

  async controller(req, res) {
    try {
      const dbModels = req.app.get('models');
      const sequelizeInstance = req.app.get('sequelize');
      const profileId = req.params.userId;
      const depositAmount = req.body.depositAmount;

      const validationSchema = this.getValidationSchema();
      const {error} = validationSchema.validate({ profileId, depositAmount})
      if(error) return  res.status(400).json({ message: error.details[0].message });

      const response = await depositBalanceServiceInstance.post(profileId, depositAmount, dbModels, sequelizeInstance);
      return res.status(response.statusCode).json(response);
    } catch(error) {
      console.error('Errorr :: DepositBalanceController :: ', error.message);
      return res.status(500).json({data: {}, status: 500, message: 'SOMETHING_WENT_WRONG' });
    }
  }
}

const depositBalanceInstance = new DepositBalance();
module.exports = depositBalanceInstance;