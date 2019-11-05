const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Recipe = require('./models/recipe.js')

const app = express();

mongoose.connect('mongodb+srv://adeola:A2yRnrkVFwajNebw@adeola-tgy1m.mongodb.net/test?retryWrites=true&w=majority').then(
  ()=>{
    console.log('connected successfully')
  }
).catch(
  (error)=>{
    console.log('error ')
    console.error(error)
  }
)

app.use((req, res, next) => {
  //res.setHeader('Access-Control-Allow-Origin', '*');
  //res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  //res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next();
});

app.use(bodyParser.json());

app.post('/api/recipes', (req, res, next) => {
  const recipe = new Recipe({
    title: req.body.title,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    time: req.body.time,
    difficulty: req.body.difficulty
  });
  //console.log(req.body)
  recipe.save().then(
    () => {
      //console.log(val)
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});

app.get('/api/recipes/:id', (req, res, next)=>{
  Recipe.findOne({
    _id:req.params.id
  }).then(
    (recipe) =>{
      res.status(201).json(recipe)
    }
  ).catch(
    (err)=>{
      res.status(404).json({
        error:err
      })
    }
  )
});

app.put('/api/recipes/:id', async (req, res, next)=>{
  //const recipePromise = Recipe.findOne({_id: req.params.id})
  const newRecipe = new Recipe(
    {
      _id: req.params.id,
      title: req.body.title,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
      time: req.body.time,
      difficulty: req.body.difficulty
    }
  )
  try{
    const updatedRecipe = await Recipe.updateOne({_id:req.params.id}, newRecipe)
    res.status(201).json(updatedRecipe)
  }catch(e){
    console.error(e)
    res.status(400).json({
      error: e
    })
  }
})

app.delete('/api/recipes/:id', async (req, res, next)=>{
  try{
    console.log(req.params)
    const recipe = await Recipe.deleteOne({_id:req.params.id})
    res.status(201).json({
      message: 'delete successful'
    })
  } catch(e){
    res.status(404).json({
      error: e
    })
  }
})


app.use('/api/recipes', (req, res, next) => {
  Recipe.find().then(
    (recipes) => {
      res.status(201).json(recipes);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
});

module.exports.app = app;
module.exports.express = express;
