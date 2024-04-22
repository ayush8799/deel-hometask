const Joi = require('joi');
const getUserContractServiceInstance = require("../services/getUserContract.service");

class GetUserContract {

  getValidationSchema() {
    return Joi.object({
      contractId: Joi.number().positive().required(),
      clientId: Joi.number().positive().required()
    });
  }

  async controller(req, res) {
    try{
      const dbModels = req.app.get('models');
      const {id: contractId} = req.params;
      const clientId = req.get('profile_id');

      const { error } = this.getValidationSchema().validate({contractId, clientId});
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const response = await getUserContractServiceInstance.fetchUserContract(contractId, clientId, dbModels);
      return res.status(response.statusCode).json(response);
    } catch(err) {
      console.error('Error :: GetUserContractController :: ', err);
      return res.status(500).json({data: {}, status: 500, message: 'SOMETHING_WENT_WRONG' });
    }
  }
}

const getUserContractInstance = new GetUserContract();
module.exports = getUserContractInstance;
