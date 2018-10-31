module.exports.new = function (req, res, application) {
  var msg = req.session.message;
  req.session.message = '';
  if (req.method == 'GET') {

    var connection = application.config.connect();
    var category = new application.app.models.Category(connection);

    category.getAllCategories(
      function (error, result) {
        if (error !== null && error.fatal == true) {
          console.log(error.sqlMessage);
        } else {
          res.render('admin/product/new.ejs', 
          {
            data: {},
            validation: {},
            msg: msg,
            categories: result,
          });
        }
      }
    );   

  } else {
    var data = req.body;
    req.assert('title', 'O campo nome é obrigatório!').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
      res.render('admin/product/new.ejs', {
        data: data,
        validation: errors,
        msg: msg
      });
    } else {

      var imageName = null;
      
      if (Object.keys(req.files).length > 0) {//image sended

        let prefix = new Date().getTime() + '_';
        imageName = prefix + req.files.image.name;
        let image = req.files.image;
        image.mv(__dirname + '/../public/upload/product_images/' + imageName, function (err) {
          if (err) {
            return res.status(500).send(err);
          }
        });

      }  
         
      let price = null;
      let small_price = null;
      let large_price = null;
      let promotional_price = null;

      if (data.price.length > 0) {
        try {
          price = JSON.stringify(data.price);
          price = price.replace(',', '.');
        } catch (error) {
          console.log(error);
        }
      }

      if (data.small_price.length > 0) {
        try {
          small_price = JSON.stringify(data.small_price);
          small_price = small_price.replace(',', '.');
        } catch (error) {
          console.log(error);
        }
      }

      if (data.large_price.length > 0) {
        try {
          large_price = JSON.stringify(data.large_price);
          large_price = large_price.replace(',', '.');
        } catch (error) {
          console.log(error);
        }
      }

      if (data.promotional_price.length > 0) {
        try {
          promotional_price = JSON.stringify(data.promotional_price);
          promotional_price = promotional_price.replace(',', '.');
        } catch (error) {
          console.log(error);
        }
      }

      let stm = `insert into product (title, description, price, small_price,
      large_price, promotional_price, category, image) 
      values('${data['title']}', '${data['description']}', 
      ${price}, ${small_price}, ${large_price}, ${promotional_price}, 
      '${data['category']}', '${imageName}')`;
      
      var connection = application.config.connect();
      var product = new application.app.models.Product(connection);

      product.save(stm, function (error, result) {
        if (error !== null && error.fatal == true) {
          res.send(error.sqlMessage);
        } else {
          req.session.message = 'Produto salvo com sucesso!';
          res.redirect('/novo_produto');
        }
      });

    }
  }
}

module.exports.show = function (req, res, application) {
  var msg = req.session.message;
  req.session.message = '';
  var connection = application.config.connect();
  var product = new application.app.models.Product(connection);
  var data = product.show(function (error, result) {
    if (error !== null && error.fatal == true) {
      res.send(error.sqlMessage);
    } else {
      res.render('admin/product/show.ejs', {
        data: result,
        msg: msg
      });
    }
  });
}

module.exports.detail = function (req, res, application) {
  var msg = req.session.message;
  req.session.message = '';
  var id = req.query.id;
  var connection = application.config.connect();
  var product = new application.app.models.Product(connection);
  product.getThis(id, function (error, products) {
    if (error) {
      res.send(error.sqlMessage);
    } else {      
      if (req.method == 'GET') {
        const category = new application.app.models.Category(connection);
        category.getAllCategories(function (error, categories){
          if (error) {
            res.send(error.sqlMessage);
          } else {
            res.render('admin/product/detail.ejs', {
              data: products[0],
              msg: msg,
              categories: categories,
              validation: {}
            });
          }
        });        
      } else {
        editProduct(req, res, product, result[0], msg);
      }
    }
  });
}

function editProduct(req, res, product, result, msg) {
  var data = req.body;

  if (!data.image) { 
    data.image = result.image; 
  } else if (data.image == '') {
    data.image = null;
  }

  req.assert('title', 'O campo título é obrigatório!').notEmpty();
  var errors = req.validationErrors();
  if (errors) {    
    res.render('admin/product/detail.ejs', {
      data: data,
      validation: errors,
      msg: msg
    });
  } else {
    const keys = Object.keys(data);
    for(const key of keys){
      if (data[key] == '') {
        data[key] = null;
      }
    }   
    let changed = false;
    let q = `update product set `;

    if (data.title != result.title) {
      q = q + `title = '${data.title}' `;
      changed = true;
    }

    if (data.description != result.description) {
      if (changed == true) {
        q = q + `, description = '${data.description}' `;  
      } else {
        q = q + `description = '${data.description}' `;
        changed = true;
      }      
    }

    if (data.price != result.price) {
      if (changed == true) {
        q = q + `, price = ${data.price} `;
      } else {
        q = q + `price = ${data.price} `;
        changed = true;
      }  
    }

    if (data.small_price != result.small_price) {
      if (changed == true) {
        q = q + `, small_price = ${data.small_price} `;
      } else {
        q = q + `small_price = ${data.small_price} `;
        changed = true;
      }  
    }

    if (data.large_price != result.large_price) {
      if (changed == true) {
        q = q + `, large_price = ${data.large_price} `;
      } else {
        q = q + `large_price = ${data.large_price} `;
        changed = true;
      }  
    }

    if (data.promotional_price != result.promotional_price) {
      if (changed == true) {
        q = q + `, promotional_price = ${data.promotional_price} `;
      } else {
        q = q + `promotional_price = ${data.promotional_price} `;
        changed = true;
      }  
    }

    if (data.image != null) {

      let prefix = new Date().getTime() + '_';
      imageName = prefix + req.files.image.name;
      let image = req.files.image;
      image.mv(__dirname + '/../public/upload/product_images/' + imageName, function (err) {
        if (err) {
          return res.status(500).send(err);
        } else {
          let oldFile = __dirname + '/../public/upload/product_images/' + result.image;
          const fs = require('fs');
          fs.unlink(oldFile, function(err){
            if(err) {
              return res.status(500).send(err);
            } else {
              console.log('File deleted with success!');
            }            
          })
        }
      });

      if (changed == true) {
        q = q + `, image = '${imageName}' `;
      } else {
        q = q + `image = '${imageName}' `;
        changed = true;
      } 

    }

    if (changed) {
      q = q + ` where id = ${result.id}`;
      product.update(q, function(error, result){
        if (error) {
          res.send(error.sqlMessage);
        } else {
          req.session.message = 'Alteração realizada com sucesso!';
          res.redirect('/exibir_produtos');
        }
      });
    } else {
      req.session.message = 'Nenhuma alteração detectada!';
      res.redirect('/exibir_produtos');
    }
  }
}
