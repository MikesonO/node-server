const Product = require('../models/product');
const Cart = require('../models/cart');


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
        res.render('shop/product-detail', {
            path: '/products',
            pageTitle: 'Product Detail',
            product: product
        });
    });
};

exports.getCart = (req, res, next) => {
    Cart.getProducts(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (product of products) {
                const cartProductData = cart.products.find(
                    prod => prod.id === product.id
                );
                if (cartProductData) {
                    cartProducts.push({ productData: product, quantity: cartProductData.quantity });
                }
            }
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: cartProducts
            });
        });
    });
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.fetchProduct(prodId, (product) => {
        Cart.addProduct(prodId, product.price);
    })
    res.redirect('/cart');
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