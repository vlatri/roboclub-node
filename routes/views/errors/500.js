import keystone from 'keystone'


exports = module.exports = (req, res) => {

  const view = new keystone.View(req, res)
  const { locals } = res

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = '500'
  res.status(500)
  // Render the view
  view.render('errors/500')
}
