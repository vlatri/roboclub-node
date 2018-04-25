import keystone from 'keystone'

import { fixPublishedDate} from '../../utils'


exports = module.exports = function (req, res) {

  const view = new keystone.View(req, res)
  const { locals } = res

  locals.section = 'albums'

  // Load the current album
  view.on('init', function (next) {
    keystone.list('Album').model
    .findOne({
      slug: req.params.item,
    })
    .exec(function (err, result) {
      if(!result) res.redirect('/404')
      locals.title = result.title
      locals.album = fixPublishedDate(result, 'DD/MM/YYYY')
      next(err)
    })
  })

  // Load other albums
  view.on('init', next => {
    keystone.list('Album').model.find({slug: {$ne: req.params.item}}).select({
      title: 1,
      heroImage: 1,
      publishedDate: 1,
      slug: 1,
    })
    .sort('-publishedDate')
    .limit(4)
    .exec((err, results) => {
      locals.albums = results ? results.map(album => fixPublishedDate(album, 'DD/MM/YYYY')) : []
      next(err)
    })

  })

  // Render the view
  view.render('album')
}
