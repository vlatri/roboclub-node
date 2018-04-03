import keystone from 'keystone'
import moment from 'moment'

import {fixPublishedDate} from '../../utils/'

moment.locale('uk')

exports = module.exports = function (req, res) {

  const view = new keystone.View(req, res)
  const locals = res.locals

  // Set locals
  locals.section = 'albums'
  locals.albums= []

  // Load posts
  view.on('init', function (next) {
    // *** ATTENTION! ***
    // No pagination is used here, template uses lazyload provided by slick.js.
    const q = keystone.list('Album').model.find({}, {
      title: 1,
      heroImage: 1,
      publishedDate: 1,
      slug: 1,
    }).sort('-publishedDate')

    q.exec(function (err, results) {
      results.map((album, i) =>
        locals.albums[i] = fixPublishedDate(album, 'DD/MM/YYYY')
      )
      next(err)
    })

  })

  // Render the view
  view.render('albums')
}
