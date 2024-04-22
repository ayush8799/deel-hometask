const { getUnpaidJobListForUserId } = require("../db/dal/queries");
const ErrorBuilder = require("../utils/error.util");

class GetUserUnpaidJobListService {
  async fetchUnpaidJobs(profileId, dbModels) {
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
      return ErrorBuilder(error.message);
    }
  }
}

const getUserUnpaidJobListServiceInstance = new GetUserUnpaidJobListService();
module.exports = getUserUnpaidJobListServiceInstance;

