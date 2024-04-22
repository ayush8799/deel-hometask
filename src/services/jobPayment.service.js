
const { getJobById, getContractById, getProfileById } = require("../db/dal/queries");

class JobPaymentService {
  async post(jobId, dbModels, sequelizeInstance) {
    try {

      const jobData = await getJobById(jobId, dbModels);
      if(!jobData) throw new Error('INVALID_DATA');
      if(jobData.paid) throw new Error("ALREADY_PAID");

      const jobPrice = jobData.price,
        contractId = jobData.ContractId;

      const contractData = await getContractById(contractId, dbModels);
      const clientId = contractData.ClientId,
        contractorId = contractData.ContractorId;

      // Initialize transaction
      const transaction = await sequelizeInstance.transaction();  
      try {
        /**
         * Read profile data with transaction and optimistic row locks
         */
        const [client, contractor] = await Promise.all([
          getProfileById(clientId, dbModels, transaction, true),
          getProfileById(contractorId, dbModels, transaction, true)
        ])

        if(client.balance < jobPrice) {
          await transaction.rollback();
          throw new Error("BALANCE_NOT_SUFFICIENT");
        }

        contractor.balance += jobPrice;
        await contractor.save({transaction});

        client.balance -= jobPrice;
        await client.save({transaction}); 

        jobData.paid = 1;
        jobData.paymentDate = new Date();
        await jobData.save({ transaction });
      } catch (error) {
        /**
         * Rollback all the transaction queries in case of any failure.
         */
        await transaction.rollback();
        if(error.message == 'BALANCE_NOT_SUFFICIENT') throw new Error(error.message);
        throw new Error('TRANSACTION_FAILED_AND_ROLLEDBACK')
      }

      /**
       * Commit all transaction queries
       */
      await transaction.commit();

      const responseObj = {
        statusCode: 200,
        data: jobData,
        message: 'Job Paid'
      }
      return responseObj;

    } catch (error) {
      console.error('Errorr :: JobPaymentService :: ', error.message);
      let responseObj = { message: error.message };
      switch (error.message) {
        case 'INVALID_DATA':
          responseObj.statusCode = 400;
          responseObj.data = {
            message: `BAD_REQUEST: Invalid data: ${jobId}`
          }
          break;
          
        case 'BALANCE_NOT_SUFFICIENT':
          responseObj.statusCode = 402;
          responseObj.data = {
            message: `Please recharge your balance to pay for job: ${jobId}`
          }
          break;

        case 'ALREADY_PAID':
          responseObj.statusCode = 400;
          responseObj.data = {
            message: `The contractor is already paid for job : ${jobId}`
          }
          break;

        case 'TRANSACTION_FAILED_AND_ROLLEDBACK':
          responseObj.statusCode = 400;
          responseObj.data = {
            message:  `The payment failed for job : ${jobId}. Please try after sometime.`
          }
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

const jobPaymentServiceInstance = new JobPaymentService();
module.exports = jobPaymentServiceInstance;

