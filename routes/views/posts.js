import keystone from 'keystone'
import moment from 'moment'


moment.locale('uk')

exports = module.exports = function (req, res) {

  const view = new keystone.View(req, res)
  const locals = res.locals

  // Set locals
  locals.section = 'posts'
  locals.data = {
    posts: [],
  }

  const getFormattedPublishedDate = (post, format) => Object.assign({}, post.toObject(), {
    publishedDate: moment(post.publishedDate).format(format)
  })

  // Load posts
  view.on('init', function (next) {
    // *** ATTENTION! ***
    // No pagination is used here, template uses lazyload provided by slick.js.
    const q = keystone.list('Post').model.find().where('state', 'published').select({
      heading: 1,
      briefDescription: 1,
      heroImage: 1,
      publishedDate: 1,
      slug: 1,
    }).sort('-publishedDate')

    q.exec(function (err, results) {
      results.map((post, i) =>
        locals.data.posts[i] = getFormattedPublishedDate(post, 'DD/MM/YYYY')
      )
      next(err)
    })

  })

  // Render the view
  view.render('posts')
}
