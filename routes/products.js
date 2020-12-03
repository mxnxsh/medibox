const express = require('express');
const router = express.Router();

const Product = require('./../models/product');

router.get('/', (req, res) => {
  Product.find().sort({
    date: -1
  }).limit(10)
    .exec((err, products) => {
      if (err) return console.log(err);
      res.render('user/index', {
        title: 'MediBox',
        products
      })
    })
  //   res.render('user/index', {
  //     title: 'MediBox'
  // });
});
/*
 *  Get all Product
 */
router.get('/shop', (req, res) => {
  Product.find()
    .sort({
      date: -1,
    })
    .exec((err, products) => {
      if (err) return console.log(err);
      res.render('user/shop', {
        title: 'Store',
        products: products,
      });
    });
});
// Exports
module.exports = router;