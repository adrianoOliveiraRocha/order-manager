module.exports.new = function (req, res, application) {
  var msg = req.session.message;
  req.session.message = '';
  if (req.method == 'GET') {
    res.render('admin/category/new.ejs', {
      data: {},
      validation: {},
      msg: msg,
    });
  } else {
    var data = req.body;
    req.assert('title', 'O campo título é obrigatório!').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
      res.render('admin/category/new.ejs', {
        data: data,
        validation: errors,
        msg: msg
      });
    } else {
      var connection = application.config.connect();
      var category = new application.app.models.Category(connection);
      category.save(data, function (error, result) {
        if (error !== null && error.fatal == true) {
          res.send(error.sqlMessage);
        } else {
          req.session.message = 'Categoria salva com sucesso!';
          res.redirect('/nova_categoria');
        }
      });
    }
  }
}

module.exports.show = function (req, res, application) {
  var msg = req.session.message;
  req.session.message = '';
  var connection = application.config.connect();
  var category = new application.app.models.Category(connection);
  var data = category.show(function (error, result) {
    if (error !== null && error.fatal == true) {
      res.send(error.sqlMessage);
    } else {
      res.render('admin/category/show.ejs', {
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
  var category = new application.app.models.Category(connection);
  category.getThis(id, function (error, result) {
    if (error !== null && error.fatal == true) {
      res.send(error.sqlMessage);
    } else {
      if (req.method == 'GET') {
        res.render('admin/category/detail.ejs', {
          data: result[0],
          msg: msg,
          validation: {}
        });
      } else {
        editCategory(req, res, category, result[0], msg);
      }
    }
  });
}
function editCategory(req, res, category, result, msg) {
  var data = req.body;
  req.assert('title', 'O campo título é obrigatório!').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    res.render('admin/category/detail.ejs', {
      data: data,
      validation: errors,
      msg: msg
    });
  } else {
    if (data.title === result.title) {
      req.session.message = 'Você não fez nehuma mudança';
      res.redirect('/exibir_categorias');
    } else {
      var stm = `update category set title = '${data.title}'
      where id = ${result.id}`;
      category.update(stm, function (error) {
        if (error !== null && error.fatal == true) {
          res.send(error.sqlMessage);
        } else {
          req.session.message = 'Atualização realizada com sucesso!';
          res.redirect('/exibir_categorias');
        }
      });
    }
  }
}