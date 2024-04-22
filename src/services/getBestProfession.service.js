
const { getBestProfessionList } = require("../db/dal/queries");
const ErrorBuilder = require("../utils/error.util");

class GetBestProfessionService {
  async fetchBestProfession(startTime, endTime, dbModels) {
    try {
      const bestProfessionList = await getBestProfessionList(startTime, endTime, dbModels);
      
      if(!bestProfessionList || !bestProfessionList.length) throw new Error('NO_DATA_FOUND');
      
      const bestProfession = bestProfessionList[0].profession || bestProfessionList[0].dataValues.profession, 
        maxEarning = bestProfessionList[0].totalEarned || bestProfessionList[0].dataValues.totalEarned;


      const responseObj = {
        statusCode: 200,
        data: {
          bestProfession,
          maxEarning,
        },
        message: 'Data fetched successfully'
      }
      
      return responseObj;
    } catch(error) {
      console.error('Errorr :: GetBestProfessionService :: ', error.message);
      return ErrorBuilder(error.message);
    }
  }
}

const getBestProfessionServiceInstance = new GetBestProfessionService();
module.exports = getBestProfessionServiceInstance

