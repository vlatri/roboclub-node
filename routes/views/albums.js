import keystone from 'keystone'

import {fixPublishedDate} from '../../utils/'


exports = module.exports = function (req, res) {

  const view = new keystone.View(req, res)
  const { locals } = res

  // Set locals
  locals.title = 'Галерея'
  locals.section = 'albums'

  // Load posts
  view.on('init', next => {
    // *** ATTENTION! ***
    // No pagination is used here, template uses lazyload provided by slick.js.
    keystone.list('Album').model.find({}, {
      title: 1,
      heroImage: 1,
      publishedDate: 1,
      slug: 1,
    })
    .sort('-publishedDate')
    .exec((err, results) => {
      locals.albums = results ? results.map((album, i) => fixPublishedDate(album, 'DD/MM/YYYY')) : []
      next(err)
    })
  })

  // Render the view
  view.render('albums')
}
