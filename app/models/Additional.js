class Additional {

  constructor(connection){
    this._connection = connection;
  }

  save(stm, callback) {    
    this._connection.query(stm, callback);
  }
  
}

module.exports = function () {
  return Additional;
}