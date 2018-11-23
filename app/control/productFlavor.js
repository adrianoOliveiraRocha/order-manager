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
      res.render('admin/productFlavor/show_prices.ejs', {
        msg: msg,
        validation: {},
        data: resultPF,
      });
    }
  });
  
}

module.exports.editPrice = function (req, res, application) {
  var msg = req.session.message;
  req.session.message = '';
  const idProduct = req.query.idProduct;
  const connection = application.config.connect();
  const productFlavor = new application.app.models.ProductFlavor(connection);
  productFlavor.getAllFromProduct(idProduct, function(errorPF, resultPF){
    if (errorPF) {
      console.error(errorPF.sqlMessage);
    } else {
      var data = req.body;
      req.assert('amount_flavor', 'O campo quantidade de sabores é obrigatório!');
      var errors = req.validationErrors();
      if (errors) {
        res.render('admin/productFlavor/detail.ejs',
          {
            data: data,
            msg: msg,
            validation: errors,
          });
      }
    }
  });
  
}