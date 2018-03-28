var keystone = require('keystone');

exports = module.exports = function (req, res) {

  var view = new keystone.View(req, res);

  // Render the view

  view.query('faqs', keystone.list('Faq').model.find())
  view.render('faq');
};
