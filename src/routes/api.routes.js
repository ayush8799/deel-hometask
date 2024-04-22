const { getProfile } = require("../middleware/getProfile");
const getUserContractInstance  = require("../controllers/getUserContract.controller");
const getUserContractsListInstance = require("../controllers/getUserContractsList.controller");
const getUserUnpaidJobListInstance = require("../controllers/getUserUnpaidJobList.controller");

let Router = function (app) {
  app.get('/contracts/:id', [getProfile], getUserContractInstance.controller.bind(getUserContractInstance));
  app.get('/contracts', [getProfile], getUserContractsListInstance.controller.bind(getUserContractsListInstance));
  app.get('/jobs/unpaid', [getProfile], getUserUnpaidJobListInstance.controller.bind(getUserUnpaidJobListInstance));
};

module.exports = Router;
