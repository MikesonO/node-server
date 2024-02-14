const path = require('path');
const express = require('express');
const shopController = require('../controllers/shop');
const router = express.Router();

// Homepage | / => GET
router.get('/', shopController.getIndex);

// Products Page | /products => GET
router.get('/products', shopController.getProducts);

// Products Detail | /products/12345 => GET 
// : tells EJS that path will contain an integer
router.get('/products/:productId', shopController.getProduct);

// // Cart Page | /cart => GET
router.get('/cart', shopController.getCart);

// // Cart Page | /cart => POST
router.post('/cart', shopController.postCart);

// // Cart Page | /cart-delete-item => POST
router.post('/cart-delete-item', shopController.postCartDeleteProduct);

// // Checkout Page | /checkout => GET
// router.get('/checkout', shopController.getCheckout);

// // Orders Page | /cart => GET
// router.get('/orders', shopController.getOrders);

module.exports = router;
