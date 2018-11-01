module.exports = function (application) {
  application.get('/novo_produto', function (req, res) {
    application.app.control.product.new(req, res, application);
  });
  application.post('/novo_produto', function (req, res) {
    application.app.control.product.new(req, res, application);
  });
  application.get('/exibir_produtos', function (req, res) {
    application.app.control.product.show(req, res, application);
  });
  application.get('/detalhes_produto', function (req, res) {
    application.app.control.product.detail(req, res, application);
  });
  application.post('/edit_product', function (req, res) {
    application.app.control.product.edit(req, res, application);
  });
}