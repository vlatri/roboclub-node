import keystone from 'keystone'


exports = module.exports = function (req, res) {

  const view = new keystone.View(req, res)
  const locals = res.locals

  // Set locals
  locals.section = 'about'

  // Load team
  view.on('init', function (next) {
    keystone.list('Presentation').model.find().exec(function (err, results) {

      locals.presentations = results

      next()
    })
  })

  // Render the view
  view.render('presentations')
}
