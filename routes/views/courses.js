import keystone from 'keystone'

exports = module.exports = function (req, res) {

  const view = new keystone.View(req, res)
  const locals = res.locals

  view.query('courseFields', keystone.list('Coursefield').model.find())
  view.query('courses', keystone.list('Course').model.find())

  view.on('init', function (next) {
    keystone.list('Course').model.find({active: true}).distinct('age').exec((err, results) => {
      locals.courseAges = results.sort((a, b) => a > b)
      next(err)
    })
  })

  view.render('courses')
}
