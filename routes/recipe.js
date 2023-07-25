const express = require("express");
const mongoose = require("mongoose");
const Recipe = require('../models/Recipes'); 
const router = express.Router();


// recipe data
const test = {}
/*const recipes = {
  pasta:
  {
    name: 'Pasta',
    instructions: ['add water', 'add salt', 'boil pasta'],
    ingredients: ['water', 'salt', 'dry pasta'],
  },
  pizza:
  {
    name: 'Pizza',
    instructions: ['set oven to 200', 'put pizza in oven', 'bake for 12 min', "put ketchup on top"],
    ingredients: ["frozen pizza", "ketchup"],
  },

  Casserole:
  {
    name: 'Casserole',
    instructions: ['set oven to 200', 'put cassabox in oven', 'bake for 26 min'],
    ingredients: ["frozen pizza", "ketchup"],
  },

  Lasagna:
  {
    name: 'Lasagna',
    instructions: ['set oven to 350', 'put lasagna in oven', 'bake for 8 min','pour milk in glass'],
    ingredients: ["frozen Lasagna", "milk"],
  },
  Tikka_Masala:
  {
    name: 'Tikka_Masala',
    instructions: ['lahti', 'bake for 8 min','pour milk water and spices'],
    ingredients: ["rice I guess", "some spices"],
  },
};*/

router.get('/:food', async (req, res) => {
  const acceptHeader = req.headers.accept;
  const food = capitalizeFirstLetter(req.params.food);

  try {
    const recipe = await Recipe.findOne({ name: food }).exec();

    if (acceptHeader && acceptHeader.includes('application/xml')) {
      if (recipe !== null) {
        res.render('index', recipe);
      } else {
        res.status(200).render('index', {
          name: food,
          instructions: ['Recipe not found.'],
          ingredients: [],
        });
      }
    } else if (recipe) {
      res.json(recipe);
    } else {
      //no recipe
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ message: 'Error fetching recipe' });
  }
});

/*router.get('/:food', (req, res) => {
  const acceptHeader = req.headers.accept;
  const food = req.params.food;
  const body = recipes[food];
  if (acceptHeader && acceptHeader.includes('application/xml')){
    if(body !== undefined){
      res.render('index',  body );
    }else{
      res.status(200).render('index', {name:food, instructions:['Recipe not found.'], ingredients: []},);
    }
  }else if (body) {

    res.json(body);
  } else {
    console.log("test")
    
  }
});*/

router.post('/', (req, res, next) => {
  const food = capitalizeFirstLetter(req.body.name);
  Recipe.findOne({ name: food }) 
    .exec()
    .then((recipe) => {
      if (!recipe) {
        return Recipe.create({
          name: food,
          instructions: req.body.instructions,
          ingredients: req.body.ingredients,
          categories: req.body.categories
        });
      } else {
        return Promise.reject('Recipe already in database.');
      }
    })
    .then((recipe) => {
      console.log('Recipe added successfully:', recipe);
      res.status(200).json({ message: 'Recipe added successfully', recipe });
    })
    .catch((error) => {
      if (error === 'Recipe already in database.') {
        return res.status(403).json(error);;
      } else {
        console.error('Error adding recipe:', error);
        return res.status(500).json({ message: 'Error adding recipe' });
      }
    });
});

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

module.exports = router;
