class Category {
  constructor(connection = null) {
    this._connection = connection;
  }
  save(data, callback) {
    let stm = `insert into category (title) 
    values('${data['title']}')`;
    this._connection.query(stm, callback);
  }
  show(callback) {
    let stm = `select * from category`;
    this._connection.query(stm, callback);
  }
  getThis(id, callback) {
    let stm = `select * from category where id = ${id}`;
    this._connection.query(stm, callback);
  }
  update(stm, callback) {
    this._connection.query(stm, callback);
  }
  getAllCategories(callback){
    this._connection.query('select * from category', callback);    
  }
  getProductsOfThis(idCatgory, callback){
    const stm = `select id, image from product where category = ${idCatgory}`;
    this._connection.query(stm, callback);
  }
  deleteProduct(idProduct, callback){
    const stm = `delete from product where id = '${idProduct}'`;
    this._connection.query(stm, callback);
  }
}
module.exports = function () {
  return Category;
}