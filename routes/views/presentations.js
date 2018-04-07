import keystone from 'keystone'


exports = module.exports = (req, res) => {
  const view = new keystone.View(req, res)
  const locals = res.locals

  locals.title = 'Презентації'
  locals.section = 'about'

  view.on('init', function (next) {
    keystone.list('Presentation').model
    .find()
    .exec((err, results) => {
      locals.presentations = results
      next()
    })
  })
  view.render('presentations')
}
