class Product {
  constructor(connection = null) {
    this._connection = connection;
  }
  save(data, callback) {
    let stm = `insert into product (title, description, price, 
      promotional_price, image) 
    values('${data['title']}', '${data['description']}', 
    ${data['price']}, ${data['promotional_price']},
    ${data['image']}')`;
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