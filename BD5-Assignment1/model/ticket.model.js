let { DataTypes, sequelize } = require('../lib');
const { agent } = require('./agent.model');
const { customer } = require('./customer.model');

let ticket = sequelize.define('ticket', {
  title: DataTypes.STRING,
  description: DataTypes.STRING,
  status: DataTypes.STRING,
  priority: DataTypes.INTEGER,
  customerId: DataTypes.INTEGER,
  agentId: DataTypes.INTEGER,
});

module.exports = { ticket };
