require('dotenv').config()
const express = require('express');
const router = express.Router();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const {
	isUser
} = require('../config/auth')


// Get Product model
const Product = require('../models/product');

/*
 * GET add product to cart
 */
router.get('/', (req, res) => {
	res.render('user/cart', {
		title: 'Store'
	});
});
router.get('/add/:_id', isUser.ensureAuthenticated, (req, res) => {
	var _id = req.params._id;
	Product.findById({ _id }, (err, p) => {
		if (err) return console.log(err);
		if (typeof req.session.cart == "undefined") {
			req.session.cart = [];
			req.session.cart.push({
				title: p.title,
				// slug: p.slug,
				qty: 1,
				price: parseFloat(p.price).toFixed(2),
				// image: '/uploads/' + p.avatar
			});
		} else {
			var cart = req.session.cart;
			var newItem = true;

			for (var i = 0; i < cart.length; i++) {
				if (cart[i]._id === _id) {
					cart[i].qty++;
					newItem = false;
					break;
				}
			}

			if (newItem) {
				cart.push({
					title: p.title,
					qty: 1,
					price: parseFloat(p.price).toFixed(2),
					// image: '/uploads/' + p.avatar
				});
			}
		}
		req.flash('success_msg', 'Product added to cart!');
		res.redirect('/cart');
	});

});

// /*
//  * GET checkout page
//  */
// router.get('/checkout', function (req, res) {

//     if (req.session.cart && req.session.cart.length == 0) {
//         delete req.session.cart;
//         res.redirect('/cart/checkout');
//     } else {
//         res.render('checkout', {
//             title: 'Checkout',
//             cart: req.session.cart
//         });
//     }

// });
/*
 * GET checkout page
 */
router.get('/checkout', (req, res) => {
	const { name, email, number, _id } = req.user
	const cartItems = JSON.stringify(req.session.cart)
	const action = req.query.action;
	const message = `Hey my name is ${name} my email ${email} and my userId ${_id} and my orders ${cartItems} and Total amount Rs.${action}`
	client.messages
		.create({
			body: message,
			from: 'whatsapp:+14155238886',
			to: `whatsapp:+91${number}`
		})
		.then(message => console.log(message.sid))
		.catch(err => `Error=> ${err}`);
	delete req.session.cart
	req.flash('success_msg', `Order confirmed Check your whatsapp no.${number} to placed your order`);
	res.redirect('back');

});


/*
 * GET update product
 */
router.get('/update/:product', function (req, res) {

	var slug = req.params.product;
	var cart = req.session.cart;
	var action = req.query.action;
	for (var i = 0; i < cart.length; i++) {
		if (cart[i].title == slug) {
			switch (action) {
				case "add":
					cart[i].qty++;
					break;
				case "remove":
					cart[i].qty--;
					if (cart[i].qty < 1)
						cart.splice(i, 1);
					break;
				case "clear":
					cart.splice(i, 1);
					if (cart.length == 0)
						delete req.session.cart;
					break;
				default:
					console.log('update problem');
					break;
			}
			break;
		}
	}

	req.flash('success_msg', 'Cart updated!');
	res.redirect('back');

});

/*
 * GET clear cart
 */
router.get('/item/clear', function (req, res) {

	delete req.session.cart;

	req.flash('success_msg', 'Cart cleared!');
	res.redirect('back');

});

/*
 * GET buy now
 */
router.get('/buynow', function (req, res) {

	delete req.session.cart;

	res.sendStatus(200);

});

// Exports
module.exports = router;