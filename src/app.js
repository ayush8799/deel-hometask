const express = require('express');
const bodyParser = require('body-parser');
const {sequelizeInstance} = require('./db/dbConnection');
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelizeInstance)
const glob = require('glob');
const path =require('path');
initModels();

// const {getProfile} = require('./middleware/getProfile')

function initModels(){
    const {Profile, Contract, Job} = require('./db/index.models');
    app.set('models', {Profile, Contract, Job});
}


// Moved this route to api.routes.js
/**
 * FIX ME!
 * @returns contract by id
 */
// app.get('/contracts/:id',getProfile ,async (req, res) =>{
//     const {Contract} = req.app.get('models')
//     const {id} = req.params
//     const contract = await Contract.findOne({where: {
//         id, 
//         ClientId: req.get('profile_id') 
//     }})
//     if(!contract) return res.status(404).end()
//     res.json(contract)
// })

glob.sync('./**/routes/**/*.js').forEach(function (routePath) {
  require(path.resolve(routePath))(app);
});

module.exports = app;
