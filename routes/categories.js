const express = require('express');
const router = express.Router();
// const auth = require('../config/auth');
// const isAdmin = auth.isAdmin;

// Get Category model
const Category = require('../models/category');

/*
 * GET category index
 */
router.get('/', (req, res) => {
   Category.find((err, categories) => {
      if (err) return console.log(err);
      res.render('admin/categories', {
         categories: categories,
      });
   });
});

/*
 * GET add category
 */
router.get('/add-categories', (req, res) => {
   const title = ''
   const error = ''
   res.render('admin/add_categories', {
      title,
      error
   });
});

/*
 * POST add category
 */
router.post('/add-categories', (req, res) => {
   const title = req.body.title;
   const slug = title.replace(/\s+/g, '-').toLowerCase();
   Category.findOne({
      slug: slug,
   },
      (err, category) => {
         if (category) {
            res.render('admin/add_categories', {
               title: title,
               error: `${category.title} exists, choose another.`
            });
         } else {
            var category = new Category({
               title: title,
               slug: slug,
            });
            category.save(err => {
               if (err) return console.log(err);
               Category.find(function (err, categories) {
                  if (err) {
                     console.log(err);
                  } else {
                     req.app.locals.categories = categories;
                  }
               });
               req.flash('success_msg', 'Category added!');
               res.redirect('/admin/categories');
            });
         }
      },
   );
});

/*
 * GET edit category
 */
router.get('/edit-categories/:id', (req, res) => {
   const error = ''
   Category.findById(req.params.id, (err, category) => {
      if (err) return console.log(err);
      res.render('admin/edit_categories', {
         title: category.title,
         id: category._id,
         error: error
      });
   });
});
/*
 * POST edit category
 */
router.post('/edit_categories/:id', (req, res) => {
   const title = req.body.title;
   const slug = title.replace(/\s+/g, '-').toLowerCase();
   const id = req.params.id;
   Category.findOne({
      slug: slug,
      _id: {
         $ne: id,
      },
   },
      (err, category) => {
         if (err) return console.log(err);
         if (category) {
            res.render('admin/edit_categories', {
               title: title,
               id: id,
               error: `${category.title} already present`
            });
         } else {
            Category.findById(id, (err, category) => {
               if (err) return console.log(err);
               category.title = title;
               category.slug = slug;
               category.save(err => {
                  if (err) return console.log(err);
                  Category.find(function (err, categories) {
                     if (err) {
                        console.log(err);
                     } else {
                        req.app.locals.categories = categories;
                     }
                  });
                  req.flash('success_msg', 'Category edited!');
                  res.redirect('/admin/categories');
               });
            });
         }
      },
   );
});
/*
 * GET delete category
 */
router.get('/delete_category/:id', function (req, res) {
   Category.findByIdAndDelete(req.params.id, function (err) {
      if (err) return console.log(err);
      Category.find(function (err, categories) {
         if (err) {
            console.log(err);
         } else {
            req.app.locals.categories = categories;
         }
      });
      req.flash('success_msg', 'Category deleted!');
      res.redirect('/admin/categories');
   });
});
// Exports
module.exports = router;