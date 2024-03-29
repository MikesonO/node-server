const path = require('path');
const express = require('express');
const { body } = require('express-validator');
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const router = express.Router();


// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/product-list => GET
router.get('/product-list', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product',
    [
        body('title')
            .isString()
            .isLength({ min: 3 })
            .trim(),
        body('price').isFloat(),
        body('description')
            .isLength({ min: 4, max: 250 })
            .trim()

    ],
    isAuth, adminController.postAddProduct);

// /admin/edit-product => GET
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

// /admin/edit-product => POST
router.post('/edit-product',
    [
        body('title')
            .isString()
            .isLength({ min: 3 })
            .trim(),
        body('price').isFloat(),
        body('description')
            .isLength({ min: 4, max: 250 })
            .trim()

    ],
    isAuth, adminController.postEditProduct);

// /admin/delete-product => DELETE
router.delete('/product/:productId', isAuth, adminController.deleteProduct);

module.exports = router;
