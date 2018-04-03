import keystone from 'keystone'

import { ensureImageHasUrl } from '../../utils/'


exports = module.exports = function (req, res) {

  const view = new keystone.View(req, res)
  const locals = res.locals

  // Set locals
  locals.section = 'about'

  // Load team
  view.on('init', function (next) {
    const q = keystone.list('Participant').model.find()

    q.exec(function (err, results) {
      locals.team = results

      next(err)
    })

  })

  // Render the view
  view.render('team')
}
