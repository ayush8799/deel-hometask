const { getProfile } = require("../middleware/getProfile");
const getUserContractInstance  = require("../controllers/getUserContract.controller");
const getUserContractsListInstance = require("../controllers/getUserContractsList.controller");
const getUserUnpaidJobListInstance = require("../controllers/getUserUnpaidJobList.controller");
const jobPaymentInstance = require("../controllers/jobPayment.controller");
const depositBalanceInstance = require("../controllers/depositBalance.controller");

let Router = function (app) {
  app.get('/contracts/:id', [getProfile], getUserContractInstance.controller.bind(getUserContractInstance));
  app.get('/contracts', [getProfile], getUserContractsListInstance.controller.bind(getUserContractsListInstance));
  app.get('/jobs/unpaid', [getProfile], getUserUnpaidJobListInstance.controller.bind(getUserUnpaidJobListInstance));
  app.post('/jobs/:job_id/pay', jobPaymentInstance.controller.bind(jobPaymentInstance));
  app.post('/balances/deposit/:userId', depositBalanceInstance.controller.bind(depositBalanceInstance));
};

module.exports = Router;
