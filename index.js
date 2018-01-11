const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

//Load passport
require('./config/passport')('passport');

//Load Routes
const auth = require('./routes/auth');

const app = express();

const port = process.env.PORT || 5000;

app.use('/auth', auth);

app.listen(port, ()=>{
  console.log(`App running on port ${port}`);
});