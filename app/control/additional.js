module.exports.new = function (req, res, application) {

  let msg = req.session.message;
  req.session.message = '';
  
  if (req.method == 'GET') {
    res.render('admin/additional/new.ejs', {
      validation: {},
      msg: msg,
      data: {}
    });
  } else {
    var data = req.body;
    req.assert('name', 'O campo nome é obrigatório').notEmpty();
    req.assert('price', 'O campo preço é obrigatório').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
      res.render('admin/additional/new.ejs', {
        validation: errors,
        msg: msg,
        data: data
      });
    } else {

      const connection = application.config.connect();
      
      let price = null;
      price = JSON.stringify(data.price);
      price = price.replace(',', '.');
            
      let stm = `insert into additional (name, price) 
      values('${data['name']}', ${price});`;

      const additional = new application.app.models.Additional(connection);
      additional.save(stm, function (error, result) {
        if (error) {
          console.log('Error trying to save: ' + error.sqlMessage);
          req.session.message = `Não foi possível completar a operação. 
          Dados definidos incorretamente!`;
          res.redirect('/novo_adicional');
        } else {
          console.log('saved: ' + result);
          req.session.message = 'Adicional salvo com sucesso!';
          res.redirect('/novo_adicional');
        }
      });
    }
    
  }  

}

module.exports.show = function (req, res, application) {
  let msg = req.session.message;
  req.session.message = '';

  const connection = application.config.connect();
  const additional = new application.app.models.Additional(connection);

  additional.getAll(function (error, result) {
    if (error) {
      res.send(error);
    } else {
      res.render('admin/additional/show.ejs', {
        additionais: result,
        msg: msg,
      });
    }
  });
}

module.exports.detail = function (req, res, application) {
  const id = req.query.id;
  const connection = application.config.connect();
  const additional = new application.app.models.Additional(connection);
  additional.getThis(id, function(error, result){
    if (error) {
      res.send(error);
    } else {
      res.render('admin/additional/detail.ejs', {
        additional: result[0],
      });
    }
  });
  
}

module.exports.edit = function (req, res, application) {

  let msg = req.session.message;
  req.session.message = '';
  var data = req.body;
  req.assert('name', 'O campo nome é obrigatório').notEmpty();
  req.assert('price', 'O campo preço é obrigatório').notEmpty();
  const errors = req.validationErrors();

  if (errors) {
    res.render('admin/additional/edit.ejs', {
      validation: errors,
      msg: msg,
      additional: data
    });
  } else {
    const id = data.id;
    const connection = application.config.connect();
    const additional = new application.app.models.Additional(connection);

    additional.getThis(id, function (error, result) {
      
      if (error) {
        res.send(error);
      } else {

        const currentAdditional = result[0];
        let changed = false;
        let q = `update additional set `;

        if (data.name != currentAdditional.name) {
          q = q + `name = '${data.name}'`;
          changed = true;
        }

        if (data.price != currentAdditional.price) {
          
          if (changed) {
            q = q + `, price = ${data.price}`;
          } else {
            q = q + `price = '${data.price}'`;
          }
          changed = true;
        }

        if (changed) {
          q = q + ` where id = ${currentAdditional.id}`;
          console.log(q);
          
          additional.update(q, function (errorSaving, resultSaving) {
            if (error) {
              console.log('Error trying to save: ' + errorSaving);
              req.session.message = 'Os dados não foram aceitos. Por favor, tente novamente!';
              res.redirect('/exibir_adicionais');
            } else {
              console.log('Success: ' + resultSaving);
              req.session.message = 'Adicional editado com sucesso!';
              res.redirect('/exibir_adicionais');
            }
          });
        } else {
          req.session.message = 'Você não fez nenhuma alteração!';
          res.redirect('/exibir_adicionais');
        }        
      }
    });
    
  }
}