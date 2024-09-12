let { DataTypes, sequelize } = require('../lib');
const { agent } = require('./agent.model');
const { ticket } = require('./ticket.model');

let ticketAgent = sequelize.define('ticketAgent', {
  ticketId: {
    type: DataTypes.INTEGER,
    references: {
      model: ticket,
      key: 'id',
    },
  },
  agentId: {
    type: DataTypes.INTEGER,
    references: {
      model: agent,
      key: 'id',
    },
  },
});

module.exports = { ticketAgent };
