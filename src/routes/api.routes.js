const { getProfile } = require("../middleware/getProfile");
const getUserContractInstance  = require("../controllers/getUserContract.controller");

let Router = function (app) {
  app.get('/contracts/:id', [getProfile], getUserContractInstance.controller.bind(getUserContractInstance));
};

module.exports = Router;
