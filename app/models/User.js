class User {

  constructor(connection = null) {
    this._connection = connection;
  }

  save(data, callback) {
    let stm = `insert into user (email, password) 
    values('${data['email']}', '${data['pwd']}')`;
    this._connection.query(stm, callback);
  }

  auth(data, callback) {
    let stm = `select * from user 
    where email = '${data.email}' and password = '${data.pwd}'`;
    this._connection.query(stm, callback);
  }

  getLogedUser(id, callback) {
    let stm = `select * from user where id = ${id}`;
    this._connection.query(stm, callback);
  }

  update(currentData, newData, callback) {
    let stm = `update user set name = '${newData.name}'
    , email = '${newData.email}', password = '${newData.pwd}'
    , cpf = '${newData.cpf}', public_place = '${newData.public_place}'
    , number = '${newData.number}', cep = '${newData.cep}'
    , complement = '${newData.complement}'
    , neighborhood = '${newData.neighborhood}'
     where id = ${currentData.id}`;

    this._connection.query(stm, callback);

  }

}

module.exports = function () {
  return User;
}