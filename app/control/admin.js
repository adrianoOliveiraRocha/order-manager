module.exports.login = function (req, res, application) {
  if (req.method == 'GET') {
    if (req.session.loged) {
      let msg = "Você já está logado";
      res.render('core/error/index.ejs', { msg: msg });
    } else {
      res.render('admin/login.ejs', { data: {}, validation: {} });
    }
  } else { // the method is post
    var data = req.body;
    req.assert('email', 'Digite seu email corretamente!').isEmail();
    req.assert('pwd', 'Senha é obrigatório!').notEmpty();
    var errors = req.validationErrors();

    if (errors) {
      res.render('admin/login.ejs', {
        data: data,
        validation: errors
      });
    } else {
      var connection = application.config.connect();
      var user = new application.app.models.User(connection);
      user.auth(data, function (error, result) {
        if (error !== null && error.fatal == true) {
          res.send(error.sqlMessage);
        } else {
          if (result.length > 0) { // user exists
            req.session.loged = true;
            req.session.user = result[0];
            req.session.message = '';
            if (result[0].is_staff === 0) { // is not admin
              res.redirect('/');
            } else { // is admin
              res.redirect('/admin');
            }
          } else { // user not exists
            let msg = "Usuário não encontrado";
            res.render('core/error/index.ejs', {
              msg: msg
            });
          }
        }
      });
    }
  }

}

module.exports.logout = function (req, res) {
  req.session.destroy();
  res.redirect('/');
}

module.exports.signup = function (req, res, application) {
  if (req['method'] == 'GET') {
    res.render('admin/signup.ejs', { data: {}, validation: {} });
  } else {
    var data = req.body;
    req.assert('email', 'Digite seu email corretamente!').isEmail();
    req.assert('pwd', 'Senha é obrigatório!').notEmpty();
    req.assert('pwd2', 'Confirme a senha!').notEmpty();
    var errors = req.validationErrors();

    if (errors) {
      res.render('admin/signup.ejs', { data: data, validation: errors });
    } else {

      if (data.pwd == data.pwd2) {

        var connection = application.config.connect();
        var user = new application.app.models.User(connection);
        user.save(data, function (error, result) {
          if (error) {
            res.send(error);
          } else {
            res.redirect('/login');
          }
        });

      } else {// the passwords are differents
        var pwd2 = [
          {
            location: 'body',
            location: 'pwd2',
            msg: 'As senhas são diferentes. Por favor, tente novamente!',
            value: data.pwd2
          },
        ]
        res.render('admin/signup.ejs', { data: data, validation: pwd2 });
      }

    }

  }
}

module.exports.admin = function (req, res, applicationl) {

  if (req.session.loged && req.session.user.is_staff === 1
    && req.session.user.is_active === 1) {
    res.render('admin/index.ejs');
  } else {
    let msg = "Desculpe, você não tem permissão para acessar essa página";
    res.render('core/error/index.ejs', { msg: msg });
  }

}

module.exports.profile = function (req, res, application) {
  if (req.method === 'GET') {

    var connection = application.config.connect();
    var user = new application.app.models.User(connection);
    user.getLogedUser(req.session.user.id,
      function (error, result) {
        if (error) {
          res.send(error);
        } else {
          let msg = req.session.message;
          req.session.message = '';
          logedUser = result[0];
          res.render('admin/profile.ejs',
            {
              user: result[0],
              validation: {},
              msg: msg,
            }
          );
        }
      });

  } else {

    req.assert('email', 'Digite seu email corretamente!').isEmail();
    req.assert('pwd', 'Senha é obrigatório!').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
      res.render('admin/profile.ejs',
        {
          user: req.session.user,
          validation: errors,
        });
    } else {
      currentData = req.session.user;
      newData = req.body;
      var connection = application.config.connect();
      var user = new application.app.models.User(connection);
      user.update(currentData, newData, function (error, result) {

        if (error) {
          res.send(error);
        } else {
          req.session.message = "Editado com sucesso!";
          res.redirect('/profile');
        }
      });

    }

  }
}

