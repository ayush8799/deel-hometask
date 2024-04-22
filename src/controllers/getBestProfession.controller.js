const Joi = require('joi');
const getBestProfessionServiceInstance = require('../services/getBestProfession.service');

class GetBestProfession {

  getValidationSchema() {
    return Joi.object({
      start: Joi.date().iso().required(),
      end: Joi.date().iso().required()
    });
  }

  async controller(req,res) {
    try {
      const dbModels = req.app.get('models');
      const {start: startTime, end: endTime} = req.query;

      const validationSchema = this.getValidationSchema();
      const { error } = validationSchema.validate({ start: startTime, end: endTime });
      if (error) return res.status(400).json({ message: error.details[0].message });

      const response = await getBestProfessionServiceInstance.fetchBestProfession(startTime, endTime, dbModels);
      return res.status(response.statusCode).json(response);

    } catch(error) {
      console.error('Errorr :: GetBestProfesssionController :: ', error.message);
      return res.status(500).json({data: {}, status: 500, message: 'SOMETHING_WENT_WRONG' });
    }
  }
}

const getBestProfessionInstance = new GetBestProfession();
module.exports = getBestProfessionInstance;;

