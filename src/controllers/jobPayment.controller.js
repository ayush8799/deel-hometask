const Joi = require('joi');
const jobPaymentServiceInstance = require('../services/jobPayment.service')

class JobPayment {

  getValidationSchema() {
    return Joi.object({
      jobId: Joi.number().integer().positive().required(),
    });
  }


  async controller(req, res) {
    try {

      const dbModels = req.app.get('models');
      const sequelizeInstance = req.app.get('sequelize');
      const jobId = req.params.job_id;


      const { error } = this.getValidationSchema().validate({ jobId });
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const response = await jobPaymentServiceInstance.post(jobId, dbModels, sequelizeInstance);
      return res.status(response.statusCode).json(response);
    } catch (error) {
      console.error('Errorr :: JobPaymentController :: ', error.message);
      return res.status(500).json({data: {}, status: 500, message: 'SOMETHING_WENT_WRONG' });
    }
  }
}

const jobPaymentInstance = new JobPayment();
module.exports = jobPaymentInstance;
