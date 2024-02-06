const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const mongoConnect = require('../util/database');

class Product {
  constructor(title, imageUrl, price, description) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    const db = getDb();
    return db
      .collection('products')
      .insertOne(this)
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  }

  static fetchAll() {
    const db = getDb();
    return db.collection('products').find().toArray();
  }

  static fetchById(prodId) {
    const db = getDb();
    return db.collection('products').findOne({
      _id: new mongodb.ObjectId(prodId)
    })
      .then(product => {
        console.log(product);
        return product;
      })
      .catch(err => {
        console.log(err);
      });
  }

}


module.exports = Product;