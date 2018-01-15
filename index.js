const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const keys = require('./config/keys');

//Load model
require('./models/user');

//Load passport
require('./config/passport')('passport');

//Load Routes
const auth = require('./routes/auth');

//Map global promises
mongoose.Promise = global.Promise;

//Mongoose Connect
mongoose.connect(keys.mongoURI, {useMongoClient: true})
.then(()=>{console.log('MongoDB connected')})
.catch((err) => console.log(err));

const app = express();

const port = process.env.PORT || 5000;

app.use('/auth', auth);

app.listen(port, ()=>{
  console.log(`App running on port ${port}`);
});