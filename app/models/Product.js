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

  getAllProducts(callback){
    this._connection.query('select * from product', callback);
  }

  getImage(id, callback) {
    let stm = `select image from product where id = ${id}`;
    console.log(stm);    
    this._connection.query(stm, callback);
  }

  update(stm, callback) {
    this._connection.query(stm, callback);
  }
  
  delete(idProduct, callback) {
    const stm = `delete from product where id = '${idProduct}'`;
    console.log(stm);
    this._connection.query(stm, callback);
  }

  getNameProduct(idProduct, callback) {
    const stm = `select title from product where id = ${idProduct}`;
    this._connection.query(stm, callback);
  }

  deletePFs(idProduto, callback) {// deleta todos os pfs para este produto
    const stm = `delete from product_flavor where product = ${idProduto}`;
    this._connection.query(stm, callback);
  }

}

module.exports = function () {
  return Product;
}