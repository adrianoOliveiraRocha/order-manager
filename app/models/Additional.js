class Additional {

  constructor(connection){
    this._connection = connection;
  }

  save(stm, callback) {    
    this._connection.query(stm, callback);
  }

  getAll(callback) {
    this._connection.query('select * from additional', callback);
  }

  getThis(id, callback) {
    const stm = `select * from additional where id = ${id}`;
    this._connection.query(stm, callback);
  }

  update(stm, callback){
    this._connection.query(stm, callback);
  }
  
}

module.exports = function () {
  return Additional;
}