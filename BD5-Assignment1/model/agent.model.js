let { DataTypes, sequelize } = require('../lib');

let agent = sequelize.define('agent', {
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

module.exports = { agent };
