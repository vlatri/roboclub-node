import keystone from 'keystone'

import { fixPublishedDate } from '../../utils/'


exports = module.exports = (req, res) => {

  const view = new keystone.View(req, res)
  const locals = res.locals

  locals.title = 'Новини'
  locals.section = 'posts'

  view.on('init', next => {
    // *** ATTENTION! ***
    // No pagination is used here, template uses lazyload provided by slick.js.
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
    .sort('-publishedDate')
    .exec((err, results) => {
      locals.posts = results ? results.map(post => fixPublishedDate(post, 'DD/MM/YYYY')) : []
      next(err)
    })
  })
  view.render('posts')
}
