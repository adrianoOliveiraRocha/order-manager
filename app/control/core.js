module.exports.index = function (req, res, application) {
  var user = {};
  if (req.session.loged) {
    user = req.session.user;
  }

  connection = application.config.connect();
  categories = new application.app.models.Category(connection);
  categories.getAllCategories(function (errorCategories, resultCategories) {
    if (errorCategories) {
      res.send(`Error trying get all categories: ${errorCategories.sqlMessage}`);
    } else {
      products = new application.app.models.Product(connection);
      products.getAllProducts(function (errorProducts, resultProducts) {
        if (errorProducts) {
          res.send(`Error trying get all categories: ${errorProducts.sqlMessage}`);
        } else {
          var menu = {}
          for (const category of resultCategories) {
            var products = [];
            for (const product of resultProducts) {
              if (category.id == product.category) {
                products.push(product);
              }
            }            
            menu[category.title] = products;            
          }
          for (const category of resultCategories) {
            console.log(menu[category.title]);
          }          
          
          res.render('core/index.ejs', 
          { 
            user: user, 
            categories: resultCategories,
            menu: menu, 
          });
        }
      });
    }
  });
}
