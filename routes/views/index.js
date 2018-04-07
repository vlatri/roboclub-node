import keystone from 'keystone'

import { fixPublishedDate} from '../../utils'


exports = module.exports = (req, res) => {

  const view = new keystone.View(req, res)
  const { locals } = res

  locals.section = 'home'

  view.query('quotes', keystone.list('Quote').model.find())
  view.query('layout', keystone.list('Layout').model.findOne())
  view.query('partners', keystone.list('Partner').model.find())

  view.on('init', next => {
    keystone.list('Post').model
    .find()
    .where('state', 'published')
    .select({
      heading: 1,
      briefDescription: 1,
      heroImage: 1,
      publishedDate: 1,
      slug: 1,
    })
    .sort('-publishedDate').limit(4)
    .exec((err, results) => {
      locals.posts = results ? results.map(post => fixPublishedDate(post, 'DD MMMM YYYY')) : []
      next(err)
    })
  })

  view.render('index')
}
