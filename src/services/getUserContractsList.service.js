
const { getNonTerminatedContractsForUserId } = require("../db/dal/queries");
const ErrorBuilder = require("../utils/error.util");

class GetUserContractListService {
  async fetchUserContracts(profileId, limit, offset, dbModels) {
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
      return ErrorBuilder(error.message);
    }
  }
}

const getUserContractListServiceInstance = new GetUserContractListService();
module.exports = getUserContractListServiceInstance

