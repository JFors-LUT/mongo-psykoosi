const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser'); 
const app = express();
//mongoDB
const mongoDB = "mongodb://127.0.0.1:27017/testdb";
mongoose.connect(mongoDB);
mongoose.Promise = Promise;
const db = mongoose.connection;

//define routes
const recipeRouter = require('./routes/recipe');
const imagesRouter = require('./routes/images');
const PORT = 3000;

db.on("Error", console.error.bind(console, "MongoDB connection error"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public'));

//use routes
app.use('/recipe', recipeRouter);
app.use('/images', imagesRouter);
//app.use('/images', upload.array('images'), imagesRouter);


app.get('/index.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.js'));
});

app.get('/', (req, res) => {
  const responseBody = { message: 'Hello, this is the response body.' };

  // Render 'index.ejs' and pass the response body as data
  res.render('index', { response: responseBody });
});

app.listen(() => console.log(`Server started on port `));


module.exports = app;


