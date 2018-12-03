module.exports.new = function (req, res, application) {
  var msg = req.session.message;
  req.session.message = '';
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
}

module.exports.save = function (req, res, application) {
  var connection = application.config.connect();
  var category = new application.app.models.Category(connection);

  var msg = req.session.message;
  req.session.message = '';
  var data = req.body;
  req.assert('title', 'O campo título é obrogatório').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    category.getAllCategories(
      function (errorCategory, result) {
        if (errorCategory) {
          console.log(errorCategory.sqlMessage);
        } else {
          res.render('admin/product/new.ejs',
            {
              data: {},
              validation: errors,
              msg: msg,
              categories: result,
            });
        }
      }
    );
  } else {// without error
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
    
    let description = null;
    if (data.description != '') {
      description = data.description;
    }    

    if (data.uniqueFlavior == 1) {// only one flavor
      let price = null;
      if (data.price != '') {
        price = data.price;
      }

      let small_price = null;
      if (data.small_price != '') {
        small_price = data.small_price;
      }

      let large_price = null;
      if (data.large_price != '') {
        large_price = data.large_price;
      }

      let promotional_price = null;
      if (data.promotional_price != '') {
        promotional_price = data.promotional_price;
      }

      const stm = `insert into product (title, description, price, small_price, 
        large_price, promotional_price, image, category, unique_flavor) 
        values('${data.title}', '${description}', ${price}, 
        ${small_price}, ${large_price}, ${promotional_price}, 
        '${imageName}', ${data.category}, 1)`;
      
      var product = new application.app.models.Product(connection);
      product.save(stm, function(errorProduct, resultProduct){
        if (errorProduct) {
          res.send('Sql error: ' + errorProduct.sqlMessage);
        } else {
          req.session.message = 'Produto salvo com sucesso!';
          res.redirect('/novo_produto');
        }
      });  

    } else {// more then one flavor

      const stm = `insert into product (title, description, image, category, 
        unique_flavor) 
        values('${data.title}', '${description}', '${imageName}', 
        ${data.category}, 0)`;
      
      var product = new application.app.models.Product(connection);
      product.save(stm, function (errorProduct, resultProduct) {
        if (errorProduct) {
          res.send('Sql error as errorProduct: ' + errorProduct.sqlMessage);
        } else {
          const productId = resultProduct.insertId;
          // this object have only elements of the table product_flavor
          var product_flavor = {};
          for (var key in data) {
            let result = key.search('qf');
            if (result != -1) {
              product_flavor[key] = data[key];
            }
          }

          var count = 1
          var element = {};
          for (var key in product_flavor) {
            element[key] = product_flavor[key];
            if (count % 5 == 0) {// I have a complete element
              element['product'] = productId;
              var productFlavor = new application.app.models.ProductFlavor(connection);
              productFlavor.save(element, function(errorPF, resultPF){
                if (errorPF) {
                  console.error(`Sql error as errorPF: ${errorPF.sqlMessage}`);
                } else {
                  console.log(`Save with id ${resultPF.insertId}`);
                }
              });
              element = {}              
            }
            count++;
          }

          req.session.message = 'Produto salvo com sucesso!';
          res.redirect('/novo_produto');
          
        }
      }); 

    }// ends more then one flavor          

  } // ends without error

}// ends save


module.exports.show = function (req, res, application) {
  var msg = req.session.message;
  req.session.message = '';
  var connection = application.config.connect();
  var product = new application.app.models.Product(connection);
  product.show(function (errorProducts, resultProducts) {
    if (errorProducts) {
      res.send(error.sqlMessage);
    } else {
      res.render('admin/product/show.ejs', {
        data: resultProducts,
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
  product.getThis(id, function (errorProducts, products) {
    if (errorProducts) {
      res.send(errorProducts.sqlMessage);
    } else {      
      const category = new application.app.models.Category(connection);
      category.getAllCategories(function (errorCategories, categories) {
        if (errorCategories) {
          res.send(errorCategories.sqlMessage);
        } else {
          var product = products[0];
          if (product.unique_flavor == 1) { //This product have only one flavor
            res.render('admin/product/detailof.ejs', {
              data: product,
              msg: msg,
              categories: categories,
              validation: {},
              pfs: {}, 
              idProduct: product.id,
            });
          } else { //This product have more than one flavor
            var product = products[0];
            const productFlavor = new application.app.models.ProductFlavor(connection);
            productFlavor.getAllFromProduct(product.id, function(errorPF, resultPF){
              if (errorPF) {
                res.send(errorPF.sqlMessage);
              } else {
                console.log(resultPF);
                res.render('admin/product/detailmof.ejs', {
                  data: product,
                  msg: msg,
                  categories: categories,
                  validation: {},
                  pfs: resultPF,
                });
              }
            });
            
          }
          
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
  product.getThis(idProduct, function (errorProduct, currentProduct) {
    if (errorProduct) {
      res.send(errorProduct.sqlMessage);
    } else {
      const category = new application.app.models.Category(connection);
      category.getAllCategories(function (errorCategories, categories) {
        if (errorCategories) {
          res.send(errorCategories.sqlMessage);
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
            if (currentProduct[0].unique_flavor == 1) {
              editProduct(req, res, product, currentProduct[0]);
              req.session.message = 'Produto editado com sucesso!';  
              res.redirect('/exibir_produtos');
            } else {
              editComplexProduct(req, res, product, currentProduct[0]);
            }            
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
      // if there is a previous file this field exists
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
      
      product.update(q, function(error, result) {
        if (error) {
          console.error('Error trying update product ' + error.sqlMessage);                
        } else {          
          console.log(result);            
        }
      });
    } else {
      if (currentProduct.unique_flavor == 1) {
        req.session.message = 'Nenhuma alteração detectada!';
        res.redirect('/exibir_produtos');
      } else {
        console.log('It is not unique flavor');
      }
    }
    
  }
}

function editComplexProduct(req, res, product, currentProduct) {
  // esse produto tinha mais de um sabor
  editProduct(req, res, product, currentProduct); //campos principais alterados
  /**Se ele tinha mais de um sabor, eu presciso verificar se a quantidade de 
   * sabores mudou
   */
  var dados = req.body;
  if (dados.uniqueFlavior == '0') { //Continua tendo mais de um sabor
    req.session.message = 'Operação realizada com sucesso'
    res.redirect('/exibir_produtos');  
  } else {//Agora o produto tem apenas um sabor
    /** Nesse caso, eu preciso deletar os pfs relacionados a esse produto */
    var price = null;
    if (dados.price) {
      price = dados.price;
    }
    var small_price = null;
    if (dados.small_price) {
      small_price = dados.small_price;
    }
    var largel_price = null;
    if (dados.largel_price) {
      largel_price = dados.largel_price;
    }
    var promotional_price = null;
    if (dados.promotional_price) {
      promotional_price = dados.promotional_price;
    }
    
    const stm = `update product set unique_flavor = 1, 
    price = ${price}, small_price = ${small_price}, 
    large_price = ${largel_price}, promotional_price = ${promotional_price} 
    where id = ${currentProduct.id}`;
    console.log(stm);
    product.update(stm, function(erro, resultado) {
      if (erro) {
        console.error(erro.sqlMessage);        
      } else { // Agora, precisamos deletar os pfs relacionados a esse produto
        product.deletePFs(currentProduct.id, function(erroDel, resultadoDel) {
          if (erroDel) {
            console.error(erroDel.sqlMessage);            
          } else {// tudo feito
            console.log(resultadoDel);
            req.session.message = 'Operação realizada com sucesso'
            res.redirect('/exibir_produtos');  
          }
        });        
      }
    });
    
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

module.exports.editPUF = function (req, res, application) {
  console.log('editPUF');
  const msg = req.session.message;
  req.session.message = '';
  const idProduct = req.body.idProduct;
  const connection = application.config.connect();
  const product = new application.app.models.Product(connection);
  product.getThis(idProduct, function (errorProduct, currentProduct) {
    if (errorProduct) {
      res.send('Ploblem when searching for product: ' + errorProduct.sqlMessage);
    } else {
      const category = new application.app.models.Category(connection);
      category.getAllCategories(function(errorCategories, categories){
        if (errorCategories) {
          res.send(`Problem searching for categories: ${errorCategories.sqlMessage}`);
        } else {
          var data = req.body;
          data.image = currentProduct[0].image;
          const idProduct = currentProduct[0].id; 
          req.assert('title', 'O campo título é obrigatório!').notEmpty();
          var errors = req.validationErrors();
          if (errors) {
            res.render('admin/product/detailof.ejs', {
              data: data,
              validation: errors,
              categories: categories,
              msg: msg, 
              idProduct: idProduct,
            });
          } else {
            // In this point, i need indentify if the uf was changed
            if (data.uniqueFlavior == 1) {
              editProduct(req, res, product, currentProduct[0]);  
            } else {
              editProductChangeToMF(req, res, product, currentProduct[0]);
            }             
            req.session.message = 'Operação realizada com sucesso'
            res.redirect('/exibir_produtos');
          }
        }
      });
    }
  });  
}

function editProductChangeToMF(req, res, product, currentProduct) {
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
    for (const key of keys) {
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

    if (data.category != currentProduct.category) {
      if (changed == true) {
        q = q + `, category = ${data.category} `;
      } else {
        q = q + `category = ${data.category} `;
        changed = true;
      }
    }

    if (data.uniqueFlavior != currentProduct.unique_flavor) {
      if (changed == true) {
        q = q + `, unique_flavor = ${data.uniqueFlavior} `;
      } else {
        q = q + `unique_flavor = ${data.uniqueFlavior} `;
        changed = true;
      }
    }

    if (Object.keys(req.files).length > 0) {

      let prefix = new Date().getTime() + '_';
      // if there is a previous file this field exists
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
      q = q + `, set price = null, small_price = null, large_price = null, promotional_price = null 
      where id = ${currentProduct.id}`; 
            
    } else {
      q = q + `set price = null, small_price = null, large_price = null, promotional_price = null 
      where id = ${currentProduct.id}`;
    }

    product.updateChangeToMF(q, function (error, result) {
      if (error) {
        console.error('Error trying update product and change to mf' + error.sqlMessage);
      } else {
        console.log(q);
       
      }
    });

  }

}