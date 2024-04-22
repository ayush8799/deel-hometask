const {Sequelize } = require("../db/dbConnection")
const { Op, literal } = Sequelize;

class GetUserUnpaidJobListService {
  async get(profileId, dbModels) {
    try {
      const jobs = await dbModels.Job.findAll(
        {
          attributes: [
            'id',
            'description',
            'price',
            'paid',
            'ContractId'
          ],
          include: [
            {
              model: dbModels.Contract,
              required: true,
              attributes: []
            }
          ],
          where: {
              [Op.or] : [
                {'$Contract.ClientId$': profileId},
                {'$Contract.ContractorId$': profileId}
              ],
              '$Contract.status$': 'in_progress',
              paid: {
                [Op.eq]: null
              }
          },
          // logging: true
        });
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

