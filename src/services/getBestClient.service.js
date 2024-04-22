
const { getBestClientsList } = require("../db/dal/queries");
const ErrorBuilder = require("../utils/error.util");

class GetBestClientService {
  async fetchBestClient(startTime, endTime, limit, offset, dbModels) {
    try {
      let bestClients = await getBestClientsList(startTime, endTime, limit, offset, dbModels);
      
      if(!bestClients.length) throw new Error('NO_DATA_FOUND');

      bestClients = bestClients && bestClients.length ? bestClients
        .map(el => {
          return {
            id: el.id || el.dataValues.id,
            fullName: `${el.firstName || el.dataValues.firstName} ${el.lastName || el.dataValues.lastName}`,
            paid: el.amountPaid || el.dataValues.amountPaid
          }
        }) : [];
      
      const responseObj = {
        statusCode: 200,
        data: { result: bestClients },
        message: 'Data fetched successfully',
      }
      return responseObj;
    } catch(error) {
      console.error('Errorr :: GetBestClientService :: ', error.message);
      return ErrorBuilder(error.message);
    }
  }
}

const getBestClientServiceInstance = new GetBestClientService();
module.exports = getBestClientServiceInstance

