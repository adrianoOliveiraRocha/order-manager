class ProductFlavor {

  constructor(connection) {
    this._connection = connection;
  }

  save(element, callback) {
    var stm = `insert into product_flavor 
    (amount_flavor, price, small_price, large_price, promotional_price, product) 
    values(`;
    var count = 1;
    for(var key in element){
      var value = null;
      if (element[key] != '') {
        value = element[key];
      }
      stm = stm + `${value}`;

      if (count == 6) {
        stm = stm + `)`;
      } else {
        stm = stm + `, `;
      }
      count ++;
    }
     this._connection.query(stm, callback);
  }

  getAllFromProduct(idProduct, callback){
    const stm = `select * from product_flavor where product = ${idProduct}`;
    this._connection.query(stm, callback);
  }

}

module.exports = function () {
  return ProductFlavor;
}