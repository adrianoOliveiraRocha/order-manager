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
          data.price = 0;
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
  product.show(function (error, result) {
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
      const category = new application.app.models.Category(connection);
      category.getAllCategories(function (error, categories) {
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
    }
  });
}

module.exports.edit = function (req, res, application){
  const msg = req.session.message;
  req.session.message = '';
  const idProduct = req.query.id;
  const connection = application.config.connect();
  const product = new application.app.models.Product(connection);
  product.getThis(idProduct, function (error, currentProduct) {
    if (error) {
      res.send(error.sqlMessage);
    } else {
      const category = new application.app.models.Category(connection);
      category.getAllCategories(function (error, categories) {
        if (error) {
          res.send(error.sqlMessage);
        } else {
          var data = req.body;
          data.image = currentProduct[0].image;
          req.assert('title', 'O campo título é obrigatório!').notEmpty();
          var errors = req.validationErrors();
          if (errors) {
            res.render('admin/product/detail.ejs', {
              data: data,
              validation: errors,
              categories: categories,
              msg: msg
            });
          } else {
            editProduct(req, res, product, currentProduct[0])
          }
          
        }
      });
      

    }
  });
}


function editProduct(req, res, product, currentProduct) {
  var data = req.body;
  data.image = currentProduct.image;

  req.assert('title', 'O campo título é obrigatório!').notEmpty();
  var errors = req.validationErrors();
  if (errors) {    
    res.render('admin/product/detail.ejs', {
      data: data,
      validation: errors,
      msg: ''
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

    if (data.title != currentProduct.title) {
      q = q + `title = '${data.title}' `;
      changed = true;
    }

    if (data.description != currentProduct.description) {
      if (changed == true) {
        q = q + `, description = '${data.description}' `;  
      } else {
        q = q + `description = '${data.description}' `;
        changed = true;
      }      
    }

    if (data.price != currentProduct.price) {
      if (changed == true) {
        q = q + `, price = ${data.price} `;
      } else {
        q = q + `price = ${data.price} `;
        changed = true;
      }  
    }

    if (data.small_price != currentProduct.small_price) {
      if (changed == true) {
        q = q + `, small_price = ${data.small_price} `;
      } else {
        q = q + `small_price = ${data.small_price} `;
        changed = true;
      }  
    }

    if (data.large_price != currentProduct.large_price) {
      if (changed == true) {
        q = q + `, large_price = ${data.large_price} `;
      } else {
        changed = true;
        q = q + `large_price = ${data.large_price} `;        
      }  
    }

    if (data.promotional_price != currentProduct.promotional_price) {
      if (changed == true) {
        q = q + `, promotional_price = ${data.promotional_price} `;
      } else {
        q = q + `promotional_price = ${data.promotional_price} `;
        changed = true;
      }  
    }

    if (data.category != currentProduct.category) {
      if (changed == true) {
        q = q + `, category = ${data.category} `;
      } else {
        q = q + `category = ${data.category} `;
        changed = true;
      }
    }

    if (Object.keys(req.files).length > 0) {
      
      let prefix = new Date().getTime() + '_';
      imageName = prefix + req.files.changeImage.name;
      let image = req.files.changeImage;

      if (changed == true) {
        q = q + `, image = '${imageName}' `;
      } else {
        changed = true;
        q = q + `image = '${imageName}' `;
      }

      image.mv(__dirname + '/../public/upload/product_images/' + imageName, 
      function (errmv) {
        if (errmv) {
          console.log('error trying upload: ' + errmv.sqlMessage);
        } else {
          if (currentProduct.image != null) {
            let oldFile = __dirname + '/../public/upload/product_images/' + currentProduct.image;
            const fs = require('fs');
            fs.unlink(oldFile, function (errul) {
              if (errul) {
                console.log('error trying delete old image:' + errul.sqlMessage);
              } else {
                console.log('Image deleted with success!');
              }
            });
          }
        }
      });

    }
    
    if (changed) {
      q = q + ` where id = ${currentProduct.id}`;
      
      product.update(q, function(error, result){
        if (error) {
          res.send(error.sqlMessage);
        } else {
          console.log(q);
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

module.exports.delete = function (req, res, application) {

  var id = req.query.id;
  const connection = application.config.connect();
  const product = new application.app.models.Product(connection);

  product.getImage(id, function(errorDel, resultImg){
    if (errorDel) {
      res.send('Erro ao tentar deletar a imagem: ' + errorDel);
    } else {
      const imageName = resultImg[0].image;
      let oldFile = __dirname + '/../public/upload/product_images/' + imageName;
      const fs = require('fs');
      fs.unlink(oldFile, function (errul) {
        if (errul) {
          console.log('error trying delete old image:' + errul.sqlMessage);
        } else {
          product.delete(id, function(errorDelProduct, delectedProduct){
            if (errorDelProduct) {
              res.send('Error trying delete product: ' + errorDelProduct);
            } else {
              console.log('Deleted product: ' + delectedProduct[0]);
              req.session.message = 'Produto deletado com sucesso!';
              res.redirect('/exibir_produtos');
            }
          });
        }
      });
    }
  });

}
