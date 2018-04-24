import keystone from 'keystone'

import {formatDate} from '../../utils/'


exports = module.exports = (req, res) => {
  const view = new keystone.View(req, res)
  const { locals } = res

  locals.title = 'Курси'
  locals.section = 'courses'
  locals.courses = []
  locals.courseFields = []
  locals.serverTimestamp = (new Date()).getTime()

  // view.query('courseFields', keystone.list('Coursefield').model.find())

  view.on('init', function (next) {
    const fieldsQuery = keystone.list('Activityfield').model.find().exec()
    .then(fields => locals.courseFields = fields)

    const coursesQuery = keystone.list('Course').model.find().exec().then((courses=[]) =>
      locals.courses = courses.map(
        course => ({
          ...course.toObject(),
          activeSinceTimestamp: (new Date(course.activeSince)).getTime(),
          activeSinceFormattedDate: formatDate(course.activeSince, 'DD MMMM YYYY')
        })
      )
    )

    Promise.all([fieldsQuery, coursesQuery])
    .then(next)
    .catch(next)
  })

  view.render('courses')
}
