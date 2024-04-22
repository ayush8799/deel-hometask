const getUserUnpaidJobListServiceInstance = require('../services/getUserUnpaidJobList.service');

class GetUserUnpaidJobList {

  async controller(req, res) {
    try{
      const dbModels = req.app.get('models');
      const profileId = req.get('profile_id');

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
