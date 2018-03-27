import keystone from 'keystone'

import { fixPublishedDate} from '../../utils'

exports = module.exports = function (req, res) {

  const view = new keystone.View(req, res)
  var locals = res.locals

  // locals.section is used to set the currently selected
  // item in the header navigation.
  locals.section = 'home'
  locals.posts = []

  view.query('quotes', keystone.list('Quote').model.find())
  view.query('layout', keystone.list('Layout').model.findOne())
  view.query('partners', keystone.list('Partner').model.find())

  view.on('init', function (next) {
    const q = keystone.list('Post').model.find().where('state', 'published').select({
      heading: 1,
      briefDescription: 1,
      heroImage: 1,
      publishedDate: 1,
      slug: 1,
    }).sort('-publishedDate').limit(4)

    q.exec(function (err, results) {
      results.map((post, i) =>
        locals.posts[i] = results ? fixPublishedDate(post, 'DD MMMM YYYY') : null
      )
      next(err)
    })
  })

	// Render the view
	view.render('index')
}
