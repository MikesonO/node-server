const Product = require('../models/product');


exports.getIndex = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/index', {
            path: '/',
            prods: products,
            pageTitle: 'All Products',
        });
    });
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/product-list', {
            path: '/products',
            pageTitle: 'Shop',
            prods: products
        });
    });
};


exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.fetchProduct(productId, product => {
        console.log(product);
    });
    res.redirect('/');
};

exports.getCart = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart'
        });
    });
};

exports.getCheckout = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/checkout', {
            path: '/checkout',
            pageTitle: 'Checkout'
        });
    });
};


exports.getOrders = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/orders', {
            path: '/orders',
            pageTitle: 'Your Orders'
        });
    });
};
