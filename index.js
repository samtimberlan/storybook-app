const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const keys = require('./config/keys');
const exphbs = require('express-handlebars');
const path = require('path');

//Load model
require('./models/user');

//Load passport
require('./config/passport')('passport');

//Load Routes
const index = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');

//Map global promises
mongoose.Promise = global.Promise;

//Mongoose Connect
//mongodb://localhost/storybook
mongoose.connect(keys.mongoURI, {useMongoClient: true})
.then(()=>{console.log('MongoDB connected')})
.catch((err) => console.log(err));

const app = express();

//Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(cookieParser());
app.use(session({
  secret: 'selfish',
  resave: true,
  saveUninitialized: false
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Set global variables
app.use((req, res,next)=> {
  res.locals.user = req.user || null;
  next();
});

//Declare static files
app.use(express.static(path.join(__dirname, 'public')));

//Use routes
app.use('/auth', auth);
app.use('/', index);
app.use('/stories', stories);

//Set port
const port = process.env.PORT || 5000;
app.listen(port, ()=>{
  console.log(`App running on port ${port}`);
});