const path = require('path');
const express = require('express');
const shopController = require('../controllers/shop');
const router = express.Router();

// Homepage | / => GET
router.get('/', shopController.getIndex);

// Products Page | /products => GET
router.get('/products', shopController.getProducts);

// Cart Page | /cart => GET
router.get('/cart', shopController.getCart);

// Checkout Page | /checkout => GET
router.get('/checkout', shopController.getCheckout);

// Orders Page | /cart => GET
router.get('/orders', shopController.getOrders);

module.exports = router;
