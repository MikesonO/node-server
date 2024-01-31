const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        path: '/admin/add-product',
        pageTitle: 'Add Product'
    });
};


exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body.title);
    product.saveProduct();
    res.redirect('/');
};


exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('admin/product-list', {
            path: '/admin/product-list',
            pageTitle: 'Admin Products',
            prods: products
        });
    });
};