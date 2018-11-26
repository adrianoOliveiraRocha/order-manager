module.exports = function (application) {
  application.get('/show_prices', function (req, res) {
    application.app.control.productFlavor.showPrices(req, res, application);
  });
  application.post('/edit_pf', function (req, res) {
    application.app.control.productFlavor.editPF(req, res, application);
  });  
  application.get('/delete', function (req, res) {
    application.app.control.productFlavor.delete(req, res, application);
  });
}