import keystone from 'keystone'

import { ensureImageHasUrl } from '../../utils/'

exports = module.exports = function (req, res) {

  const view = new keystone.View(req, res)
  const locals = res.locals

  // Set locals
  locals.section = 'about'

  // Load team
  view.on('init', function (next) {
    keystone.list('Partner').model.find().exec(function (err, results) {

      locals.partners = results.map(result =>
        ensureImageHasUrl(result.toObject(), 'image', {
          url: '/images/fallbacks/partner.jpg', mimetype: 'image/jpeg',
        })
      )
        next(err)
    })
  })

  // Render the view
  view.render('partners')
}
