module.exports.index = function (req, res) {
  var user = {};
  if (req.session.loged) {
    user = req.session.user;
  }

  res.render('core/index.ejs', { user: user });

}
