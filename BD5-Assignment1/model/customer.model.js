let { DataTypes, sequelize } = require('../lib');

let customer = sequelize.define('customer', {
  name: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
});

module.exports = { customer };
