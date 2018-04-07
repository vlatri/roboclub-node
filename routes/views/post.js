import keystone from 'keystone'

import { fixPublishedDate } from '../../utils/'


exports = module.exports = (req, res) => {
  const view = new keystone.View(req, res)
  const { locals } = res

  locals.section = 'posts'

  locals.filters = { post: req.params.post }

  view.on('init', function (next) {
    keystone.list('Post').model
    .findOne({
      state: 'published',
      slug: locals.filters.post,
    })
    .populate({
      path: 'sections',
      options: { sort: {sequenceNumber: 1} }
    })
    .exec((err, result) => {
      locals.title = result.title
      locals.post = result ? fixPublishedDate(result, 'DD/MM/YYYY') : res.redirect('/404')
      next(err)
    })
  })

  view.on('init', next => {
    keystone.list('Post').model
    .find({slug: {$ne: req.params.post}})
    .where('state', 'published')
    .select({
      heading: 1,
      briefDescription: 1,
      heroImage: 1,
      publishedDate: 1,
      slug: 1,
    })
    .sort('-publishedDate')
    .limit(4)
    .exec((err, results) => {
      locals.posts = results ? results.map(post => fixPublishedDate(post, 'DD/MM/YYYY')) : []
      next(err)
    })
  })

  view.render('post')
}
