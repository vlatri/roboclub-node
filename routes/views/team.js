import keystone from 'keystone'

import { ensureImageHasUrl } from '../../utils/'


exports = module.exports = (req, res) => {
  const view = new keystone.View(req, res)
  const { locals } = res

  locals.title = 'Команда'
  locals.section = 'about'

  view.on('init', next => {
    keystone.list('Participant').model
    .find()
    .exec((err, results) => {
      locals.team = results
      next(err)
    })
  })
  view.render('team')
}
