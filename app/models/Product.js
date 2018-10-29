class Product {

  constructor(connection = null) {
    this._connection = connection;
  }

  save(stm, callback) {    
    this._connection.query(stm, callback);
  }

  show(callback) {
    let stm = `select * from product`;
    this._connection.query(stm, callback);
  }

  getThis(id, callback) {
    let stm = `select * from product where id = ${id}`;
    this._connection.query(stm, callback);
  }

  update(stm, callback) {
    console.log(stm);
    this._connection.query(stm, callback);
  }
}

module.exports = function () {
  return Product;
}