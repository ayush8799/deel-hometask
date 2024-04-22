const Joi = require('joi');
const getUserUnpaidJobListServiceInstance = require('../services/getUserUnpaidJobList.service');

class GetUserUnpaidJobList {

  getValidationSchema() {
    return Joi.object({
      profileId: Joi.number().integer().positive().required(),
    });
  }

  async controller(req, res) {
    try{
      // const {Job, Contract} = req.app.get('models');
      const dbModels = req.app.get('models');
      const profileId = req.get('profile_id');

      const { error } = this.getValidationSchema().validate({profileId });
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const response = await getUserUnpaidJobListServiceInstance.get(profileId, dbModels);
      return res.status(response.statusCode).json(response);
      
    } catch(err) {
      console.error('Error :: GetUserUnpaidJobListController :: ', err);
      return res.status(500).json({data: {}, status: 500, message: 'SOMETHING_WENT_WRONG' });
    }
  }
}

const getUserUnpaidJobListInstance = new GetUserUnpaidJobList();
module.exports = getUserUnpaidJobListInstance;
