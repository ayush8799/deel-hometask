
const { getProfileById, getBalanceDueForClientId } = require("../db/dal/queries");

class DepositBalanceService {
  async post(profileId, depositAmount, dbModels, sequelizeInstance) {
    try {
      let profile = await getProfileById(profileId, dbModels);
      if(!profile) throw new Error('PROFILE_NOT_FOUND');
      if(profile.type != 'client') throw new Error('INVALID_PROFILE_TYPE');

      // Initialize transaction to avoid race condition with other transactions
      const transaction = await sequelizeInstance.transaction();
      try {
        /**
         * Read balance data with transaction and optimistic row locks
         */
        const totalBalanceDue = await getBalanceDueForClientId(profileId, dbModels, transaction);

        const depositLimit = Math.floor((totalBalanceDue || 0) / 4);
        if(depositLimit < depositAmount) throw new Error('DEPOSIT_LIMIT_EXCEEDED');

        profile.balance += depositAmount;
        await profile.save({transaction});
      } catch (error) {
        await transaction.rollback();
        if(error.message == 'DEPOSIT_LIMIT_EXCEEDED') throw new Error(error.message);
        throw new Error('TRANSACTION_FAILED_AND_ROLLEDBACK');
      }

      await transaction.commit();
      const responseObj = {
        statusCode : 200,
        data: {profile},
        message: 'successfully deposited money'
      }

      return responseObj;
    } catch(error) {
      console.error('Errorr :: DepositBalanceController :: ', error.message);
      let responseObj = {message: error.message};
      switch (error.message) {
        case 'PROFILE_NOT_FOUND':
          responseObj.statusCode = 400;
          responseObj.data = {
            message: `BAD_REQUEST: Invalid user id: ${profileId}`
          };
           break;

        case 'INVALID_PROFILE_TYPE':
          responseObj.statusCode = 403;
          responseObj.data = {
            message: `FORBIDDEN: user type forbidden to add amount: ${profileId}`
          };
          break;

        case 'DEPOSIT_LIMIT_EXCEEDED':
          responseObj.statusCode = 400;
          responseObj.data = {
           message: `User deposit limit exceeded : ${profileId}`
          };
          break;

        case 'TRANSACTION_FAILED_AND_ROLLEDBACK':
          responseObj.statusCode = 400;
          responseObj.data = {
           message: `Transaction failed for user : ${profileId}. Please try again after some time.`
          };
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

const depositBalanceServiceInstance = new DepositBalanceService();
module.exports = depositBalanceServiceInstance

