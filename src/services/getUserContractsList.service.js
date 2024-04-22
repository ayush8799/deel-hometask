
const { getNonTerminatedContractsForUserId } = require("../db/dal/queries");

class GetUserContractListService {
  async get(profileId, limit, offset, dbModels) {
    try {
      const contract = await getNonTerminatedContractsForUserId(profileId, limit, offset, dbModels);  
      if(!contract || !contract.length) throw new Error("NO_DATA_FOUND");

      const responseObj = {
        statusCode: 200,
        data: contract,
        message: 'Successfully fetched user contracts'
      }

      return responseObj;
    } catch (error) {
       console.error('Error :: GetUserContractListService :: ', error);
      let responseObj = { message: error.message };
      switch (error.message) {
        case 'NO_DATA_FOUND':
          responseObj.statusCode = 204;
          responseObj.data = {
            message: `No data found for user : ${profileId}`
          }
          break;

        default:
          responseObj.statusCode = 500;
          responseObj.data = {};
          responseObj.message = 'SOMETHING_WENT_WRONG';
          break;
      }
      return responseObj
    }
  }
}

const getUserContractListServiceInstance = new GetUserContractListService();
module.exports = getUserContractListServiceInstance

