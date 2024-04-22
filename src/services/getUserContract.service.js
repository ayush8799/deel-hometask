
const { getContractById } = require("../db/dal/queries");
const ErrorBuilder = require("../utils/error.util");

class GetUserContractService {
  async fetchUserContract(contractId, clientId, dbModels) {
    try {
      const contract = await getContractById(contractId, dbModels);
      if(!contract) throw new Error("INVALID_DATA");

      if(contract.ClientId != clientId)  throw new Error("FORBIDDEN");

      const responseObj = {
        statusCode: 200,
        data: contract,
        message: 'Successfully fetched user contract'
      }

      return responseObj;
    } catch (error) {
       console.error('Error :: GetUserContractService :: ', error);
       return ErrorBuilder(error.message);
    }
  }
}

const getUserContractServiceInstance = new GetUserContractService();
module.exports = getUserContractServiceInstance

