
const { getJobById, getContractById, getProfileById } = require("../db/dal/queries");
const ErrorBuilder = require("../utils/error.util");

class JobPaymentService {
  async processJobPayment(jobId, dbModels, sequelizeInstance) {
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
      return ErrorBuilder(error.message);
    }
  }
}

const jobPaymentServiceInstance = new JobPaymentService();
module.exports = jobPaymentServiceInstance;

