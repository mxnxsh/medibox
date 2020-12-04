const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const flash = require('connect-flash');

const app = express();
// Passport Config
require('./config/passport')(passport);
app.set('view engine', 'ejs');
app.use(
   bodyParser.urlencoded({
      extended: true,
   }),
);
app.use(express.static('public'));
// Express session
app.use(
   session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true,
   }),
);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
// Connect flash
app.use(flash());
// Global variables
app.use(function (req, res, next) {
   res.locals.success_msg = req.flash('success_msg');
   res.locals.error_msg = req.flash('error_msg');
   res.locals.danger_msg = req.flash('danger_msg');
   res.locals.error = req.flash('error');
   next();
});
//connect to database
const url = 'mongodb://localhost:27017/medibox'
// const url = "mongodb+srv://admin-manish:rockstar123@cluster0-9koh3.mongodb.net/medibox&w=majority"
mongoose.connect(url, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
   console.log('Database is connected successfully on port 27017!!!');
});

// Set global errors variable
app.locals.errors = null;
app.get('*', function (req, res, next) {
   res.locals.cart = req.session.cart;
   res.locals.user = req.user || null;
   next();
});

// Get Category Model
const Category = require('./models/category');

// Get all categories to pass to header.ejs
Category.find((err, categories) => {
   if (err) {
      console.log(err);
   } else {
      app.locals.categories = categories;
   }
});

app.get('/about', (req, res) => {
   res.render('user/about', {
      title: 'About'
   });
});
app.get('/register', (req, res) => {
   res.render('user/register', {
      title: 'Register'
   });
});
app.get('/login', (req, res) => {
   res.render('user/login', {
      title: 'Login'
   });
});

// app.get('/cart', (req, res) => {
//    res.render('user/cart', {
//       title: 'Store'
//    });
// });
app.get('/cart/checkout', (req, res) => {
   res.render('user/checkout', {
      title: 'Store'
   });
});
app.get('/thankyou', (req, res) => {
   res.render('user/thankyou', {
      title: 'Store'
   });
});

// adding routes
const dashboard = require('./routes/dashboard');
const users = require('./routes/users');
const category = require('./routes/categories');
const adminproduct = require('./routes/admin_products');
const product = require('./routes/products');
const cart = require('./routes/cart.js');

// using routes
app.use('/', product);
app.use('/admin', dashboard);
app.use('/users', users);
app.use('/admin/categories', category);
app.use('/admin/products', adminproduct);
app.use('/cart', cart);

// Connect with the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));