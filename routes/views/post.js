import keystone from 'keystone'

import { fixPublishedDate} from '../../utils'


exports = module.exports = function (req, res) {

  const view = new keystone.View(req, res)
  const locals = res.locals

  // Set locals
  locals.section = 'posts'
  locals.filters = {
    post: req.params.post,
  }
  locals.data = {
    posts: [],
  }

  // Load the current post
  view.on('init', function (next) {
    const q = keystone.list('Post').model
      .findOne({
        state: 'published',
        slug: locals.filters.post,
      })
      .populate({path: 'sections', options: { sort: {sequenceNumber: 1} } })


    q.exec(function (err, result) {
      locals.data.post = result ? fixPublishedDate(result, 'DD/MM/YYYY') : res.redirect('/404')
      next(err)
    })

  })

  // Load other posts
  view.on('init', function (next) {

    const q = keystone.list('Post').model.find({slug: {$ne: req.params.post}}).where('state', 'published').select({
      heading: 1,
      briefDescription: 1,
      heroImage: 1,
      publishedDate: 1,
      slug: 1,
    }).sort('-publishedDate').limit(4)

    q.exec(function (err, results) {
      results.map((post, i) =>
        locals.data.posts[i] = results ? fixPublishedDate(post, 'DD/MM/YYYY') : null
      )
      next(err)
    })

  })

  // Render the view
  view.render('post')
}
