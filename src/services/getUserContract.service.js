
const { getContractById } = require("../db/dal/queries");

class GetUserContractService {
  async get(contractId, clientId, dbModels) {
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
       let responseObj = {message: error.message};
       switch (error.message) {
        case "INVALID_DATA":
          responseObj.statusCode = 400;
          responseObj.data = {};
          break;

        case "FORBIDDEN":
          responseObj.statusCode = 403;
          responseObj.data = {};
          break;
       
        default:
          responseObj.statusCode = 500;
          responseObj.data = {};
          responseObj.message = 'SOMETHING_WENT_WRONG';
          break;
       }

       return responseObj;
    }
  }
}

const getUserContractServiceInstance = new GetUserContractService();
module.exports = getUserContractServiceInstance

