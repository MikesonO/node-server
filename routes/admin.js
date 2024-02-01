const path = require('path');
const express = require('express');
const adminController = require('../controllers/admin');
const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

// /admin/product-list => GET
router.get('/product-list', adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);

// /admin/eddit-product => POST
router.get('/edit-product/:productId', adminController.getEditProduct);


module.exports = router;
