module.exports = function (application) {

  application.get('/novo_adicional', function (req, res) {
    application.app.control.additional.new(req, res, application);
  });

  application.post('/novo_adicional', function (req, res) {
    application.app.control.additional.new(req, res, application);
  });

  application.get('/exibir_adicionais', function (req, res) {
    application.app.control.additional.show(req, res, application);
  });

  application.get('/detalhes_adicional', function (req, res) {
    application.app.control.additional.detail(req, res, application);
  });

  application.post('/edit_additional', function (req, res) {
    application.app.control.additional.edit(req, res, application);
  });

  application.post('/delete_additional', function (req, res) {
    application.app.control.additional.delete(req, res, application);
  });

}