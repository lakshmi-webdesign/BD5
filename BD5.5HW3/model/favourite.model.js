let { DataTypes, sequelize } = require('../lib');
const { user } = require('./user.model');
const { recipe } = require('./recipe.model');

let favourite = sequelize.define('favourite', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: user,
      key: 'id',
    },
  },
  recipeId: {
    type: DataTypes.INTEGER,
    references: {
      model: recipe,
      key: 'id',
    },
  },
});

user.belongsToMany(recipe, { through: favourite });
recipe.belongsToMany(user, { through: favourite });

module.exports = { favourite };
