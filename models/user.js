const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
    constructor(username, email, cart, id) {
        this.name = username;
        this.email = email;
        this.cart = cart || {
            items: []
        }; // {items: []}
        this._id = id;
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    addToCart(product) {
        console.log(this.cart.items)

        const cartProductIndex = this.cart.items.findIndex(cartProduct => {
            return cartProduct.productId.toString() === product._id.toString();
        });

        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];

        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1; // Increase product quantity
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({
                productId: new ObjectId(product._id),
                quantity: newQuantity
            })
        }


        const updatedCart = {
            items: updatedCartItems
        }

        const db = getDb();
        return db
            .collection('users')
            .updateOne({
                _id: new ObjectId(this._id)
            }, {
                $set: {
                    cart: updatedCart
                }
            });

    }

    getCart() {
        const db = getDb();

        const productIds = [];
        const quantities = {};

        this.cart.items.forEach((ele) => {
            let prodId = ele.productId;

            productIds.push(prodId);
            quantities[prodId] = ele.quantity;
        });

        return db
            .collection('products')
            .find({
                _id: {
                    $in: productIds
                }
            })
            .toArray()
            .then((products) => {
                return products.map((p) => {
                    return {
                        ...p,
                        quantity: quantities[p._id]
                    };
                });
            });
    }

    deleteFromCart(productId) {
        const updatedCartItems = this.cart.items.filter(item => {
            return item.productId.toString() !== productId.toString();
        });

        console.log(updatedCartItems);

        const db = getDb();
        return db
            .collection('users')
            .updateOne({
                _id: new ObjectId(this._id)
            }, {
                $set: {
                    cart: {
                        items: updatedCartItems
                    }
                }
            });

    }


    addOrder() {
        const db = getDb();
        return db.collection('orders').insertOne(this.cart)
            .then(result => {
                this.cart = {
                    items: []
                };
                return db
                    .collection('users')
                    .updateOne({
                        _id: new ObjectId(this._id)
                    }, {
                        $set: {
                            cart: {
                                items: []
                            }
                        }
                    });
            });
    }

    static findById(userId) {
        const db = getDb();
        return db
            .collection('users')
            .findOne({
                _id: new ObjectId(userId)
            })
            .then(user => {
                console.log(user);
                return user;
            })
            .catch(err => {
                console.log(err);
            });
    }
}

module.exports = User;