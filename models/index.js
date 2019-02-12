'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'development'
const config = require('../config/config.json')[env]
const db = {}

let sequelize
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config)
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .forEach(file => {
    let model = sequelize.import(path.join(__dirname, file))
    if (model.name) {
      db[model.name] = model
    } else {
      Object.keys(model).forEach((key) => {
        db[model[key].name] = model[key]
      })
    }
  })

async function addModelAssociations () {
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db)
    }
  })
}

const BLESSING_STEPS = [
  'Holy Wine',
  'Benediction Prayer',
  'Indemnity Stick',
  'Education',
  'Donation',
  '40 day',
  '3 day'
]

async function addBlessingSteps () {
  for (const step of BLESSING_STEPS) {
    await db.ActionType.findOrCreate({
      where: {
        name: step
      }
    })
  }
}

addModelAssociations()
  .then(addBlessingSteps)
  .catch(err => console.log(err))

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
