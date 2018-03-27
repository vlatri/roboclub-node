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

      locals.missions = results
      next(err)
    })
  })

  view.query('donation', keystone.list('Donation').model.findOne())


  // Render the view
  view.render('mission')
}
