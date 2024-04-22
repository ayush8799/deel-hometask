/**
 * Model Relations
 */


const {Profile} = require('./models/Profile.model');
const {Contract} = require('./models/Contract.model');
const {Job} = require('./models/Job.model');

Profile.hasMany(Contract, {as :'Contractor',foreignKey:'ContractorId', onDelete: 'CASCADE'});
Contract.belongsTo(Profile, {as: 'Contractor'});
Profile.hasMany(Contract, {as : 'Client', foreignKey:'ClientId', onDelete: 'CASCADE'});
Contract.belongsTo(Profile, {as: 'Client'});
Contract.hasMany(Job);
Job.belongsTo(Contract);

module.exports = {Profile, Contract, Job};