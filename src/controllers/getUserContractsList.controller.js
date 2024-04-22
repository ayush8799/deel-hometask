const getUserContractListServiceInstance = require('../services/getUserContractsList.service');

class GetUserContractsList {

  async controller(req, res) {
    try{
      const dbModels = req.app.get('models');
      const profileId = req.get('profile_id');
    
      // As this is a listing api, added limit offset to avoid sending large data sets and introduce pagination
      let {limit = '20', offset = '0'} = req.query;
      limit = parseInt(limit);
      offset = parseInt(offset);

      const response = await getUserContractListServiceInstance.get(profileId, limit, offset, dbModels);
      return res.status(response.statusCode).json(response);
    } catch(err) {
      console.error('Error :: GetUserContractsListController :: ', err);
      return res.status(500).json({data: {}, status: 500, message: 'SOMETHING_WENT_WRONG' });
    }
  }
}

const getUserContractsListInstance = new GetUserContractsList();
module.exports = getUserContractsListInstance;

