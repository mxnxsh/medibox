const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const { isUser ,isAdmin} = require('../config/auth');
// const errors = []

// Get Users model
const User = require('../models/user');


/*
 * POST register
 */
router.post(
   '/register',
   [
      // Name Validation
      check('name', 'Name is required.').not().isEmpty(),

      // Email validation
      check('email', 'Invalid email id').trim().isEmail(),

      // Phone number
      check('number')
         .isInt()
         .withMessage('phone field must contain numbers only')
         .trim()
         .isLength({
            min: 10,
            max: 10,
         })
         .withMessage('must be 10 digits'),
      check('password', 'Password is required!').notEmpty(),
   ],

   (req, res) => {
      const { name, email, number, password } = req.body;
      var errors = validationResult(req);
      // console.log(errors);
      if (!errors.isEmpty()) {
         res.render('user/register', {
            errors: errors.errors,
            user: null,
            title: 'Register',
            name: name,
            email: email,
            number: number,
         });
      } else {
         User.findOne(
            {
               email: email,
            },
            function (err, user) {
               if (err) console.log(err);
               if (user) {
                  console.log('Email already exists');
                  req.flash('error_msg', 'Email already exists');
                  res.redirect('/users/register');
               } else {
                  var user = new User({
                     name: name,
                     email: email,
                     number: number,
                     password: password,
                     admin: 0,
                  });
                  bcrypt.genSalt(10, (err, salt) => {
                     bcrypt.hash(user.password, salt, (err, hash) => {
                        if (err) {
                           console.log(err);
                           if (
                              err.message.indexOf('duplicate key error') > -1
                           ) {
                              req.flash('error_msg', 'Email already in use');
                              // console.log('Email already in use');
                           } else {
                              req.flash(
                                 'error_msg',
                                 'There was a problem with your registration',
                              );
                           }
                        }
                        user.password = hash;
                        user.save(function (err) {
                           if (err) {
                              console.log(err);
                           } else {
                              req.flash(
                                 'success_msg',
                                 'You are now registered! Please log in',
                              );
                              res.redirect('/users/login');
                           }
                        });
                     });
                  });
               }
            },
         );
      }
   },
);


/*
 * POST login
 */
router.post('/login', (req, res, next) => {
   passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/users/login',
      failureFlash: true,
   })(req, res, next);
});

/*
 * GET logout
 */
router.get('/logout', function (req, res) {
   req.logout();
   req.flash('success_msg', 'You are logged out!');
   res.redirect('/users/login');
});


// Exports
module.exports = router;
