import keystone from 'keystone'

import { ensureImageHasUrl } from '../../utils/'

exports = module.exports = function (req, res) {

  const view = new keystone.View(req, res)
  const locals = res.locals

  // Set locals
  locals.section = 'about'

  // Load team
  view.on('init', function (next) {
    keystone.list('Mission').model.find().exec(function (err, results) {

      locals.missions = results.map(result =>
        ensureImageHasUrl(result.toObject(), 'image', {
          url: '/images/fallbacks/mission.jpg', mimetype: 'image/jpeg',
        })
      )

      keystone.list('Donation').model.find().limit(1).exec(function(err, result) {
        locals.donation = result[0]
        next(err)
      })
    })
  })

  // Render the view
  view.render('mission')
}