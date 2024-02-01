const Product = require('../models/product');

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        console.log(editMode);
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.fetchProduct(prodId, product => {
        if (!product) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            path: '/admin/edit-product',
            pageTitle: 'Edit Product',
            editing: editMode,
            product: product
        });
    });
};


exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        path: '/admin/add-product',
        pageTitle: 'Add Product',
        editing: false
    });
};


exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    const product = new Product(null, title, imageUrl, price, description);
    product.saveProduct();
    res.redirect('/');
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    const updatedProduct = new Product(prodId, updatedTitle, updatedImageUrl, updatedPrice, updatedDescription);
    updatedProduct.saveProduct();
    res.redirect('/admin/product-list')
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