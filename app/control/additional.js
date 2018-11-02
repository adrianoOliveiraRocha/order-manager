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