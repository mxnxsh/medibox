const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(
   bodyParser.urlencoded({
      extended: true,
   }),
);
app.use(express.static('public'));

//connect to database
mongoose.connect('mongodb://localhost:27017/medibox', {
   useNewUrlParser: true,
   useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
   console.log('Database is connected successfully on port 27017!!!');
});

//TODO

app.get('/', (req, res) => {
   res.render('user/index', {
      title: 'MediBox'
   });
});
app.get('/shop', (req, res) => {
   res.render('user/shop', {
      title: 'Store'
   });
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
app.get('/shop-single', (req, res) => {
   res.render('user/shop-single', {
      title: 'Store'
   });
});
app.get('/cart', (req, res) => {
   res.render('user/cart', {
      title: 'Store'
   });
});
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
app.listen(3000, function () {
   console.log('Server started on port 3000');
});