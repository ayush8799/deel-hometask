const {Sequelize } = require("../dbConnection")
const { Op, literal } = Sequelize;

const getContractById = async (id, dbModels) => {
  const contract = await dbModels.Contract.findOne({where: {id}});
  return contract;
}

const getJobById = async (id, dbModels) => {
  const job = await dbModels.Job.findOne({where:{ id }});
  return job;
}

const getProfileById = async (id, dbModels, transaction = null, lock = false) => {
  let queryObj = {
    where: {id}
  };
  
  /**
   * Add locking mechanism to the profile retrieval if requested by a transaction process.
   * This is useful to ensure that no other transactions can modify.
   */
  if(transaction) queryObj.transaction = transaction;
  if(lock) queryObj.lock = true;
  
  const profile = await dbModels.Profile.findOne(queryObj);
  return profile;
}

const getNonTerminatedContractsForUserId = async(userId, limit, offset, dbModels) => {
  const contracts = await dbModels.Contract.findAll(
    {
      where: {
        [Op.or]: [{ClientId: userId}, {ContractorId: userId}],
        status: {
          [Op.ne]: 'terminated',
        }
      },
      limit: limit,
      offset: offset
    });
    return contracts
}

const getUnpaidJobListForUserId = async (userId, dbModels) => {
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
            {'$Contract.ClientId$': userId},
            {'$Contract.ContractorId$': userId}
          ],
          '$Contract.status$': 'in_progress',
          paid: {
            [Op.eq]: null
          }
      }
    });
    return jobs;
}

const getBalanceDueForClientId = async(clientId, dbModels, transaction) => {
  /**
   * Add locking mechanism to the profile retrieval if requested by a transaction process.
   * This is useful to ensure that no other transactions can modify.
   */
  const totalBalanceDue = await dbModels.Job.sum('price', {
    where: {
      paid: { [Op.eq]: null } 
    },
    include: [
      {
        model: dbModels.Contract,
        required: true,
        include: [
          {
            model: dbModels.Profile,
            as: 'Client',
            where: {
              id: clientId
            },
            required: true
          }
        ]
      }
    ],
    transaction,
    lock: true
  });

  return totalBalanceDue;
}

module.exports = {
  getContractById,
  getJobById,
  getNonTerminatedContractsForUserId,
  getProfileById,
  getUnpaidJobListForUserId,
  getBalanceDueForClientId
}
