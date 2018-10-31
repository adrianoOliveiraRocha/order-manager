module.exports = function (application) {
  application.get('/nova_categoria', function (req, res) {
    application.app.control.category.new(req, res, application);
  });
  application.post('/nova_categoria', function (req, res) {
    application.app.control.category.new(req, res, application);
  });
  application.get('/exibir_categorias', function (req, res) {
    application.app.control.category.show(req, res, application);
  });
  application.get('/detalhes', function (req, res) {
    application.app.control.category.detail(req, res, application);
  });
  application.post('/detalhes', function (req, res) {
    application.app.control.category.detail(req, res, application);
  });
  application.get('/delete_category', function (req, res) {
    application.app.control.category.delete(req, res, application);
  });
}