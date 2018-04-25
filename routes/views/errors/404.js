import keystone from 'keystone'


exports = module.exports = (req, res) => {

  const view = new keystone.View(req, res)
  const { locals } = res

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'home'
  res.status(404)
  // Render the view
  view.render('errors/404')
}
