let express = require('express');
const { sequelize } = require('./lib');
const { user } = require('./model/user.model');
const { recipe } = require('./model/recipe.model');
const { favourite } = require('./model/favourite.model');
const { Op } = require('@sequelize/core');
let app = express();
const PORT = 3000;

let usersData = [
  {
    username: 'foodlover',
    email: 'foodlover@example.com',
    password: 'securepassword',
  },
];

let recipesData = [
  {
    title: 'Spaghetti Carbonara',
    chef: 'Chef Luigi',
    cuisine: 'Italian',
    preparationTime: 30,
    instructions:
      'Cook spaghetti. In a bowl, mix eggs, cheese, and pepper. Combine with pasta and pancetta.',
  },
  {
    title: 'Chicken Tikka Masala',
    chef: 'Chef Anil',
    cuisine: 'Indian',
    preparationTime: 45,
    instructions:
      'Marinate chicken in spices and yogurt. Grill and serve with a creamy tomato sauce.',
  },
  {
    title: 'Sushi Roll',
    chef: 'Chef Sato',
    cuisine: 'Japanese',
    preparationTime: 60,
    instructions:
      'Cook sushi rice. Place rice on nori, add fillings, roll, and slice into pieces.',
  },
  {
    title: 'Beef Wellington',
    chef: 'Chef Gordon',
    cuisine: 'British',
    preparationTime: 120,
    instructions:
      'Wrap beef fillet in puff pastry with mushroom duxelles and bake until golden.',
  },
  {
    title: 'Tacos Al Pastor',
    chef: 'Chef Maria',
    cuisine: 'Mexican',
    preparationTime: 50,
    instructions:
      'Marinate pork in adobo, grill, and serve on tortillas with pineapple and cilantro.',
  },
];

app.get('/seed_db', async (req, res) => {
  try {
    await sequelize.sync({ force: true });
    await user.bulkCreate(usersData);
    await recipe.bulkCreate(recipesData);
    res.status(200).json({ message: 'Database seede d successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/users/:id/favorite', async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let recipeId = parseInt(req.query.recipeId);
    let data = { userId: id, recipeId: recipeId };
    let newFavourite = await favourite.create(data);
    res.status(200).json({ message: 'Recipe favorited', newFavourite });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/users/:id/unfavorite', async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let recipeId = parseInt(req.query.recipeId);
    let deletedData = await favourite.destroy({
      where: { userId: id, recipeId: recipeId },
    });
    if (!deletedData) {
      return res
        .status(404)
        .json({ message: 'This recipe is not in your favourite list' });
    }
    res.status(200).json({ message: 'Recipe unfavorited' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/users/:id/favorites', async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let likedData = await favourite.findAll({
      where: { userId: id },
      attributes: ['recipeId'],
    });

    let recipeIds = [];
    for (let i = 0; i < likedData.length; i++) {
      recipeIds.push(likedData[i].recipeId);
    }

    let favoritedRecipes = await recipe.findAll({
      where: { id: { [Op.in]: recipeIds } },
    });

    if (favoritedRecipes.length === 0) {
      return res.status(404).json({ message: 'No recipes found' });
    }
    res.status(200).json({ favoritedRecipes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
