const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');//Needs Middleware
const session = require('express-session');//Needs Middleware
const bodyParser = require('body-parser');//Needs Middleware
const methodOverride = require('method-override'); //Needs Middleware
const cookieParser = require('cookie-parser');//Needs Middleware
const keys = require('./config/keys');
const exphbs = require('express-handlebars');//Needs Middleware
const path = require('path');

let year = new Date();
year = year.getFullYear();

//Load models
require('./models/user');
require('./models/Story');

//Load passport
require('./config/passport')('passport');

//Load Routes
const index = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');

//Handlebars Helpers
const {
  truncate,
  stripTags, 
  formatDate,
  select, 
  editIcon
} = require('./helpers/hbs');

//Map global promises
mongoose.Promise = global.Promise;

//Mongoose Connect
//mongodb://localhost/storybook
mongoose.connect(keys.mongoURI, {useMongoClient: true})
.then(()=>{console.log('MongoDB connected')})
.catch((err) => console.log(err));

const app = express();

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//MMethod Override
app.use(methodOverride('_method'))

//Handlebars Middleware
app.engine('handlebars', exphbs({
  helpers: {
    truncate : truncate,
    stripTags : stripTags,
    formatDate : formatDate,
    select: select,
    editIcon : editIcon
  },
  defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Cookie parser Middleware
app.use(cookieParser());
app.use(session({
  secret: 'selfish',
  resave: true,
  saveUninitialized: false
}));

//Passport Middleware
app.use(passport.initialize());

//Session Middleware
app.use(passport.session());

//Set global variables
app.use((req, res,next)=> {
  res.locals.user = req.user || null;
  res.locals.year = year;
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