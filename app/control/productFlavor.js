module.exports.showPrices = function (req, res, application) {
  var msg = req.session.message;
  req.session.message = '';
  const idProduct = req.query.idProduct;
  const connection = application.config.connect();
  const productFlavor = new application.app.models.ProductFlavor(connection);
  productFlavor.getAllFromProduct(idProduct, function (errorPF, resultPF) {
    if (errorPF) {
      console.error(errorPF.sqlMessage);
    } else {
      const product = new application.app.models.Product(connection);
      product.getNameProduct(idProduct, function(errorProduct, resultProduct){
        if (errorProduct) {
          res.send(errorProduct.sqlMessage);
        } else {
          res.render('admin/productFlavor/show_prices.ejs', {
            msg: msg,
            validation: {},
            data: resultPF,
            productName: resultProduct[0].title,
          });
        }
      });
    }
  });
  
}

module.exports.editPF = function (req, res, application) {

  var msg = req.session.message;
  req.session.message = '';
  var body = req.body;
  const connection = application.config.connect();
  const productFlavor = new application.app.models.ProductFlavor(connection);

  productFlavor.editPF(body, function(errorPF, resultPF) {
    if (errorPF) {
      res.send(errorPF.sqlMessage);
    } else {
      console.log(resultPF);
      req.session.message = 'Preço atualizado com sucesso';
      res.redirect('/show_prices');
    }
  });

}