import keystone from 'keystone'

import { fixPublishedDate} from '../../utils'


exports = module.exports = function (req, res) {

  const view = new keystone.View(req, res)
  const locals = res.locals

  // Set locals
  locals.section = 'courses'
  locals.filters = {
    course: req.params.course,
  }
  locals.courses = []

  // Load the current post
  view.on('init', function (next) {
    const q = keystone.list('Course').model
      .findOne({
        active: true,
        slug: locals.filters.course,
      })
      .populate({path: 'sections', options: { sort: {sequenceNumber: 1} } })


    q.exec(function (err, result) {
      locals.course = result
      next(err)
    })

  })

  // Load other posts
  view.on('init', function (next) {

    keystone.list('Course').model.find({slug: {$ne: req.params.post}, active: true}).select({
      title: 1,
      briefDescription: 1,
      heroImage: 1,
      slug: 1,
      age: 1,
    })
    .limit(4)
    .exec()
    .then(res => {
      locals.courses = res
      next()
    })
    .catch(next)

  })

  // Render the view
  view.render('course')
}
