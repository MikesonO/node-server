const products = [];
module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  saveProduct() {
    products.push(this);
  }

  static fetchAll() {
    return products;
  }
}
