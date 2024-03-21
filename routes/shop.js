const path = require('path');
const express = require('express');
const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

// Homepage | / => GET
router.get('/', shopController.getIndex);

// Products Page | /products => GET
router.get('/products', shopController.getProducts);

// Products Detail | /products/12345 => GET 
// : tells EJS that path will contain an integer
router.get('/products/:productId', shopController.getProduct);

// Cart Page | /cart => GET
router.get('/cart', isAuth, shopController.getCart);

// Cart Page | /cart => POST
router.post('/cart', isAuth, shopController.postCart);

// Cart Page | /cart-delete-item => POST
router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

// Orders Page | /orders => POST
router.post('/create-order', isAuth, shopController.postOrder);

// Orders Page | /cart => GET
router.get('/orders', isAuth, shopController.getOrders);

module.exports = router;
