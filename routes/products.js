const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const {
    check,
    validationResult
} = require('express-validator');
const fs = require('fs');

// const auth = require('../config/auth');
// const isAdmin = auth.isAdmin;
const helpers = require('./../middleware/helper');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    },
});

// Get Product model
const Product = require('./../models/product');
// Get Ctaegory model
const Category = require('./../models/category');

router.get('/', (req, res) => {
    Product.find({}, (err, products) => {
        if (err) return console.log(err);
        res.render('admin/products', {
            products: products,
        });
    });
});

/*
 * GET add product
 */
router.get('/add-products', (req, res) => {
    const {
        title,
        desc,
        dummyPrice,
        price,
        quantity
    } = '';

    Category.find((err, categories) => {
        if (err) return console.log(err);
        res.render('admin/add_products', {
            title,
            desc,
            dummyPrice,
            categories,
            price,
            quantity
        });
    });
});
/*
 * POST add product
 */
router.post('/add-products', (req, res) => {
    let upload = multer({
        storage: storage,
        fileFilter: helpers.imageFilter,
    }).single('avatar');
    upload(req, res, err => {
        const {
            title,
            desc,
            dummyPrice,
            price,
            category,
            quantity
        } = req.body;
        const slug = title.replace(/\s+/g, '-').toLowerCase();
        var imageFile = typeof req.file !== 'undefined' ?
            req.file.filename : '';
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        } else if (err instanceof multer.MulterError) {
            return res.send(err);
        } else if (err) {
            return res.send(err);
        }
        const round_Of_Price = price.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        // const round_Of_dummyPrice = dummyPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        const product = new Product({
            title,
            slug,
            desc,
            price: round_Of_Price,
            dummyPrice,
            quantity,
            category,
            avatar: imageFile,
        });
        product.save(err => {
            if (err) return console.log(err);
            req.flash('success_msg', 'Product added successfully!');
            res.redirect('/admin/products');
        });
    });
});

/*
 * GET edit product
 */
router.get('/edit-products/:_id', (req, res) => {
    Category.find((err, categories) => {
        if (err) return console.log(err);
        Product.findById(req.params._id, (err, product) => {
            if (err) {
                console.log(err);
                res.redirect('/admin/products');
            }
            res.render('admin/edit_products', {
                title: product.title,
                slug: product.slug,
                desc: product.desc,
                price: product.price,
                quantity: product.quantity,
                dummyPrice: product.dummyPrice,
                categories: categories,
                category: product.category.replace(/\s+/g, '-').toLowerCase(),
                image: product.avatar,
                _id: product._id
            });
        });
    });
});
/*
 * POST edit product
 */
router.post('/edit-products/:_id', (req, res) => {
    let upload = multer({
        storage: storage,
        fileFilter: helpers.imageFilter,
    }).single('avatar');
    upload(req, res, err => {
        if (err) return console.log(err);
        const {
            title,
            desc,
            price,
            dummyPrice,
            category,
            pimage,
        } = req.body;
        var imageFile = typeof req.file !== 'undefined' ?
            req.file.filename : '';
        const slug = title.replace(/\s+/g, '-').toLowerCase();
        Product.findById(req.params._id, (err, product) => {
            if (err) return console.log(err);
            product.title = title;
            product.slug = slug;
            product.desc = desc;
            product.price = price;
            product.dummyPrice = dummyPrice;
            product.category = category;
            if (imageFile != '') {
                product.avatar = imageFile;
            }
            product.save(err => {
                if (err) return console.log(err);
                if (imageFile != '') {
                    if (pimage != '') {
                        fs.unlink('public/uploads/' + pimage, err => {
                            if (err) {
                                return console.log(err);
                            } else if (path === 'public/uploads') {
                                console.log('Image are not present');
                            } else {
                                console.log(`File deleted!`);
                            }
                        });
                    }
                }
                req.flash('success_msg', 'Product Edited successfully!');
                res.redirect('/admin/products');
            });
        });
    });
});

/*
 * GET delete product
 */
router.get('/delete-product/:_id', (req, res) => {
    Product.findByIdAndDelete(req.params._id, function (err, data) {
        if (err) return console.log(err);
        const path = 'public/uploads/' + data.avatar;
        fs.unlink(path, err => {
            if (path === 'public/uploads') {
                console.log('Image are not present');
            } else if (err) {
                console.log(`dont solve this error ${err}`);
            } else {
                console.log('Successfully Avatar is deleted');
            }
        });
    });
    req.flash('success_msg', 'Product deleted successfully!!');
    res.redirect('/admin/products');
});

// Exports
module.exports = router;