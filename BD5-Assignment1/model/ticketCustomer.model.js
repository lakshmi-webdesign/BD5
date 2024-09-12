let { DataTypes, sequelize } = require('../lib');
const { customer } = require('./customer.model');
const { ticket } = require('./ticket.model');

let ticketCustomer = sequelize.define('ticketCustomer', {
  ticketId: {
    type: DataTypes.INTEGER,
    references: {
      model: ticket,
      key: 'id',
    },
  },
  customerId: {
    type: DataTypes.INTEGER,
    references: {
      model: customer,
      key: 'id',
    },
  },
});

module.exports = { ticketCustomer };
