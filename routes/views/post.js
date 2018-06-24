import keystone from 'keystone'

import { fixPublishedDate } from '../../utils/'


exports = module.exports = (req, res) => {
  const view = new keystone.View(req, res)
  const { locals } = res

  locals.section = 'posts'

  view.on('init', function (next) {
    keystone.list('Post').model
    .findOne({
      state: 'published',
      slug: req.params.item,
    })
    .populate('sections')
    .populate('relatedAlbum')
    .exec((err, result) => {
      if(result) {
        locals.title = result.title
        locals.post = fixPublishedDate(result, 'DD/MM/YYYY')
      } else res.redirect('/404')
      next(err)
    })
  })

  view.on('init', next => {
    keystone.list('Post').model
    .find({slug: {$ne: req.params.item}})
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
