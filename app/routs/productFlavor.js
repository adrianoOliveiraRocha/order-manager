module.exports = function (application) {
  application.get('/show_prices', function (req, res) {
    application.app.control.productFlavor.showPrices(req, res, application);
  });
  application.post('/edit_price', function (req, res) {
    application.app.control.productFlavor.editPrice(req, res, application);
  });  
}