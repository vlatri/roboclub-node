import keystone from 'keystone'

import { fixPublishedDate} from '../../utils'


exports = module.exports = function (req, res) {

  const view = new keystone.View(req, res)
  const locals = res.locals

  // Set locals
  locals.section = 'albums'
  locals.filters = {
    album: req.params.album,
  }
  locals.albums = []

  // Load the current album
  view.on('init', function (next) {
    keystone.list('Album').model
    .findOne({
      slug: locals.filters.album,
    })
    .populate('sections')
    .exec(function (err, result) {
      locals.album = result ? fixPublishedDate(result, 'DD/MM/YYYY') : res.redirect('/404')
      next(err)
    })
  })

  // Load other albums
  view.on('init', function (next) {

    const q = keystone.list('Album').model.find({slug: {$ne: req.params.album}}).select({
      title: 1,
      heroImage: 1,
      publishedDate: 1,
      slug: 1,
    }).sort('-publishedDate').limit(4)

    q.exec(function (err, results) {
      results.map((album, i) =>
        locals.data.albums[i] = results ? fixPublishedDate(album, 'DD/MM/YYYY') : null
      )
      next(err)
    })

  })

  // Render the view
  view.render('album')
}
