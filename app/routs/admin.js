module.exports = function(application) {

  application.get('/login', function(req, res){
    application.app.control.admin.login(req, res, application);
  });
  application.post('/login', function (req, res) {
    application.app.control.admin.login(req, res, application);
  });

  application.get('/signup', function (req, res) {
    application.app.control.admin.signup(req, res, application);
  });
  application.post('/signup', function (req, res) {
    application.app.control.admin.signup(req, res, application);
  });

  application.get('/logout', function (req, res) {
    application.app.control.admin.logout(req, res);
  });

  application.get('/admin', function (req, res) {
    application.app.control.admin.admin(req, res, application);
  })

  application.get('/profile', function (req, res) {
    application.app.control.admin.profile(req, res, application);
  });
  application.post('/profile', function (req, res) {
    application.app.control.admin.profile(req, res, application);
  });

}