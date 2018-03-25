import keystone from 'keystone'
import moment from 'moment'


moment.locale('uk')

exports = module.exports = function (req, res) {

  const view = new keystone.View(req, res)
  const locals = res.locals

  // Set locals
  locals.section = 'post'
  locals.filters = {
    post: req.params.post,
  }
  locals.data = {
    posts: [],
  }

  const getFormattedPublishedDate = (post, format) => Object.assign({}, post.toObject(), {
    publishedDate: moment(post.publishedDate).format(format)
  })

  // Load the current post
  view.on('init', function (next) {
    const q = keystone.list('Post').model.findOne({
      state: 'published',
      slug: locals.filters.post,
    })

    q.exec(function (err, result) {
      locals.data.post = getFormattedPublishedDate(result, 'DD/MM/YYYY')
      next(err)
    })

  })

  // Load other posts
  view.on('init', function (next) {

    const q = keystone.list('Post').model.find({slug: {$ne: req.params.post}}).where('state', 'published').select({
      heading: 1,
      briefDescription: 1,
      coverImage: 1,
      publishedDate: 1,
      slug: 1,
    }).sort('-publishedDate').limit(4)

    q.exec(function (err, results) {
      results.map((post, i) =>
        locals.data.posts[i] = getFormattedPublishedDate(post, 'DD/MM/YYYY')
      )
      next(err)
    })

  })

  // Render the view
  view.render('post')
}
