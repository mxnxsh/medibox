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
// const url ='mongodb://localhost:27017/medibox'
// const url = "mongodb+srv://admin-manish:rockstar123@cluster0-9koh3.mongodb.net/medibox&w=majority"
// mongoose.connect(url, {
//    useNewUrlParser: true,
//    useUnifiedTopology: true,
// });

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
//    console.log('Database is connected successfully on port 27017!!!');
// });

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
// Connect with the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
