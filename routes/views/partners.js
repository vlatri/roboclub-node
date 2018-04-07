import keystone from 'keystone'


exports = module.exports = function (req, res) {
  const view = new keystone.View(req, res)
  const { locals } = res

  locals.title = 'Партнери'
  locals.section = 'about'

  view.on('init', function (next) {
    keystone.list('Partner').model
    .find()
    .exec((err, results) => {
      locals.partners = results
      next(err)
    })
  })

  view.render('partners')
}
