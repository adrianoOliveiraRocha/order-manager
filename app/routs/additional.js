module.exports = function (application) {

  application.get('/novo_adicional', function (req, res) {
    application.app.control.additional.new(req, res, application);
  });

  application.post('/novo_adicional', function (req, res) {
    application.app.control.additional.new(req, res, application);
  });

}