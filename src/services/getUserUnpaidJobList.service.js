const { getUnpaidJobListForUserId } = require("../db/dal/queries");

class GetUserUnpaidJobListService {
  async get(profileId, dbModels) {
    try {
      const jobs = await getUnpaidJobListForUserId(profileId, dbModels);
      if(!jobs || !jobs.length) throw new Error("NO_DATA_FOUND");

      const responseObj = {
        statusCode: 200,
        data: jobs,
        message: 'Successfully fetched user unpaid jobs'
      }

      return responseObj;
    } catch (error) {
       console.error('Error :: GetUserUnpaidJobListService :: ', error);
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

const getUserUnpaidJobListServiceInstance = new GetUserUnpaidJobListService();
module.exports = getUserUnpaidJobListServiceInstance;

