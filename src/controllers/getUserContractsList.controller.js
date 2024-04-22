const Joi = require('joi');
const getUserContractListServiceInstance = require('../services/getUserContractsList.service');

class GetUserContractsList {

  getValidationSchema() {
    return Joi.object({
      profileId: Joi.number().integer().positive().required(),
      limit: Joi.number().integer().min(1).default(2),
      offset: Joi.number().integer().min(0).default(0)
    });
  }

  async controller(req, res) {
    try{
      const dbModels = req.app.get('models');
      const profileId = req.get('profile_id');
    
      // As this is a listing api, added limit offset to avoid sending large data sets and introduce pagination
      let {limit = '20', offset = '0'} = req.query;
      limit = parseInt(limit);
      offset = parseInt(offset);

      const { error } = this.getValidationSchema().validate({profileId, limit, offset });
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const response = await getUserContractListServiceInstance.fetchUserContracts(profileId, limit, offset, dbModels);
      return res.status(response.statusCode).json(response);
    } catch(err) {
      console.error('Error :: GetUserContractsListController :: ', err);
      return res.status(500).json({data: {}, status: 500, message: 'SOMETHING_WENT_WRONG' });
    }
  }
}

const getUserContractsListInstance = new GetUserContractsList();
module.exports = getUserContractsListInstance;

