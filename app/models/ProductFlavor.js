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

  editPF(pf, callback) {
    
    var amount_flavor = 1;
    if (pf.amount_flavor) {
      amount_flavor = 1;
    }
    var price = null;
    if (pf.price) {
      price = pf.price;
    }
    var small_price = null;
    if (pf.small_price) {
      small_price = pf.small_price;
    }
    var large_price = null;
    if (pf.large_price) {
      large_price = pf.large_price;
    }
    var promotional_price = null;
    if (pf.promotional_price) {
      promotional_price = pf.promotional_price;
    }

    const stm = `update product_flavor set amount_flavor = ${amount_flavor}, 
    price = ${price}, small_price = ${small_price}, 
    large_price = ${large_price}, promotional_price = ${promotional_price} 
    where id = ${pf.idPF}`;
    this._connection.query(stm, callback);  

  }

}

module.exports = function () {
  return ProductFlavor;
}