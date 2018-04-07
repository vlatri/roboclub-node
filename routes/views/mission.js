import keystone from 'keystone'


exports = module.exports = function (req, res) {
  const view = new keystone.View(req, res)
  const { locals } = res

  locals.title = 'Місія'
  locals.section = 'about'

  view.query('donation', keystone.list('Donation').model.findOne())

  view.on('init', function (next) {
    keystone.list('Mission').model
    .find()
    .exec((err, results) => {
      locals.missions = results
      next(err)
    })
  })

  view.render('mission')
}
