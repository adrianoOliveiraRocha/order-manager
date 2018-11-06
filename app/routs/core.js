module.exports = function (application) {

  application.get('/', function (req, res) {
    application.app.control.core.index(req, res, application);
  });

  
}