const express = require('express');
const router = express.Router();

const Product = require('./../models/product');
/*
 *  Get Product on Index page
 */
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
/*
 * GET product details
 */
router.get('/shop-single/:slug/:id', (req, res) => {
  Product.findById({
    _id: req.params.id
  }, (err, product) => {
    if (err) return console.log(err)
    res.render('user/shop-single', {
      title: 'Store',
      product
    })
  })
});
/*
 * GET category product details
 */
router.get('/shop-category/:slug/', (req, res) => {
  Product.find({ category: req.params.slug })
    .sort({ date: -1 })
    .exec((err, products) => {
      if (err) return console.log(err);
      res.render('user/shop-category', {
        title: 'Store',
        products
      })
    })
});
// Exports
module.exports = router;