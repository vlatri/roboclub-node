import keystone from 'keystone'

import { fixPublishedDate} from '../../utils'


exports = module.exports = (req, res) => {

  const view = new keystone.View(req, res)
  const { locals } = res

  // Set locals
  locals.section = 'courses'
  locals.filters = {
    course: req.params.course,
  }

  // Load the current course
  view.on('init', function (next) {
    keystone.list('Course').model
    .findOne({
      active: true,
      slug: locals.filters.course,
    })
    .populate({path: 'relatedAlbum', populate: {path: 'sections'}})
    .populate('sections')
    .exec(function (err, result) {
      if(result) locals.course = result
      else res.redirect('/404')
      next(err)
    })
  })

  // Load other courses
  view.on('init', function (next) {

    keystone.list('Course').model
    .find({slug: {$ne: req.params.post}, active: true})
    .select({
      title: 1,
      briefDescription: 1,
      heroImage: 1,
      slug: 1,
      age: 1,
    })
    .limit(4)
    .exec((err, res) => {
      locals.title = res.title
      locals.courses = res
      next(err)
    })
  })

  // Render the view
  view.render('course')
}
