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
    console.log(stm);
    this._connection.query(stm, callback);
  }
}
module.exports = function () {
  return Category;
}