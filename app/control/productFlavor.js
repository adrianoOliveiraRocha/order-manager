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
      product.getThis(idProduct, function(errorProduct, resultProduct){
        if (errorProduct) {
          res.send(errorProduct.sqlMessage);
        } else {
          res.render('admin/productFlavor/show_prices.ejs', {
            msg: msg,
            validation: {},
            data: resultPF,
            product: resultProduct[0],
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
      res.send(`An error ocorr try save ` + errorPF.sqlMessage);
    } else {
      console.log(resultPF);
      req.session.message = 'Preço atualizado com sucesso';
      res.redirect('/exibir_produtos');
    }
  });

}

module.exports.delete = function (req, res, application) {
  const idPF = req.query.idPF;
  const connection = application.config.connect();
  const productFlavor = new application.app.models.ProductFlavor(connection);
  productFlavor.delete(idPF, function(error, result) {
    if (error) {
      res.send(error.sqlMessage);
    } else {
      console.log(result);
      req.session.message = 'Operação realizada com sucesso';
      res.redirect('/exibir_produtos');
    }
  });
}

module.exports.salvarPF = function (req, res, application) {
  var dados = req.body;
  console.log(dados);
  const connection = application.config.connect();
  const productFlavor = new application.app.models.ProductFlavor(connection);
  /** 
   * Registro independente porque não estamos vindo de uma alteração em um produto 
   * nem da criação de um produto novo. Trata-se da criação de um novo preço 
   * para um produto que já existe */ 
  productFlavor.registroIndependente(dados, function (erro, Resultado) {
    if (erro) {
      console.error(erro.sqlMessage);      
      res.send(erro.sqlMessage);
    } else {
      console.log(Resultado);
      req.session.message = 'Operação realizada com sucesso!';
      res.redirect('/exibir_produtos');
    }
  }); 

}