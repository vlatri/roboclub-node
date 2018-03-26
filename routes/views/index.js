var keystone = require('keystone')

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res)
	var locals = res.locals

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home'

  view.query('quotes', keystone.list('Quote').model.find())
  view.query('layout', keystone.list('Layout').model.find())
  view.query('partner', keystone.list('Partner').model.find())
  view.query('post', keystone.list('Post').model.find().limit(4))

	// Render the view
	view.render('index')
}
