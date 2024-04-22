const getUserContractServiceInstance = require("../services/getUserContract.service");

class GetUserContract {

  async controller(req, res) {
    try{
      const dbModels = req.app.get('models');
      const {id: contractId} = req.params;
      const clientId = req.get('profile_id');

      const response = await getUserContractServiceInstance.get(contractId, clientId, dbModels);
      return res.status(response.statusCode).json(response);
    } catch(err) {
      console.error('Error :: GetUserContractController :: ', err);
      return res.status(500).json({data: {}, status: 500, message: 'SOMETHING_WENT_WRONG' });
    }
  }
}

const getUserContractInstance = new GetUserContract();
module.exports = getUserContractInstance;
