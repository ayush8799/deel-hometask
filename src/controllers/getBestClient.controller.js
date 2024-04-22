const Joi = require('joi');
const getBestClientServiceInstance = require('../services/getBestClient.service');

class GetBestClient {
  
  getValidationSchema() {
    return Joi.object({
      start: Joi.date().iso().required(),
      end: Joi.date().iso().required(),
      limit: Joi.number().integer().min(1).default(2),
      offset: Joi.number().integer().min(0).default(0)
    });
  }

  async controller(req, res) {
    try {
      const dbModels = req.app.get('models');
      let {start: startTime, end: endTime, limit = '2', offset = '0'} = req.query;
      limit = parseInt(limit);
      offset = parseInt(offset);

      const validationSchema = this.getValidationSchema();
      const { error } = validationSchema.validate({ start: startTime, end: endTime, limit, offset });
      if (error) return res.status(400).json({ message: error.details[0].message });
      
      const response = await getBestClientServiceInstance.fetchBestClient(startTime, endTime, limit, offset, dbModels)
      return res.status(response.statusCode).json(response);
    } catch(error) {
      console.error('Errorr :: GetBestClientController :: ', error.message);
      return res.status(500).json({data: {}, status: 500, message: 'SOMETHING_WENT_WRONG' });
    }
  }
}

const getBestClientInstance = new GetBestClient()
module.exports = getBestClientInstance;
