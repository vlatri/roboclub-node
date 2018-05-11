export default (keystone, formatDate) => (title, listName, path, section) => ({
  single: (req, res) => {
    const view = new keystone.View(req, res)
    const { locals } = res
    const serverTimestamp = (new Date()).getTime()

    locals.section = section
    locals.path = path

    // Load the current activity
    view.on('init', function (next) {
      keystone.list(listName).model
      .findOne({ slug: req.params.item })
      .populate('relatedAlbum')
      .exec((err, result) => {
        if(!result) return res.redirect('/404')
        locals.activity = result
        locals.title = result.title
        next(err)
      })
    })

    // Load other activities
    view.on('init', function (next) {
      keystone.list(listName).model
      .find({slug: {$ne: req.params.item}})
      .select({
        title: 1,
        briefDescription: 1,
        heroImage: 1,
        slug: 1,
        minimumAge: 1,
        maximumAge: 1,
        activeSince: 1,
      })
      .limit(4)
      .exec((err, res) => {
        locals.activities = res.filter(activity => (new Date(activity.activeSince)).getTime() < serverTimestamp)
        next(err)
      })
    })

    view.render('activity')
  },


  multi: (req, res) => {
    const view = new keystone.View(req, res)
    const { locals } = res

    locals.activities = []
    locals.fields = []
    locals.serverTimestamp = (new Date()).getTime()
    locals.title = title
    locals.section = section
    locals.path = path

    view.on('init', function (next) {
      const fieldsQuery = keystone.list('Activityfield').model.find().exec()
      .then(fields => locals.fields = fields)

      const activitiesQuery = keystone.list(listName).model.find().exec().then((activities=[]) =>
        locals.activities = activities.map(
          activity => ({
            ...activity.toObject(),
            activeSinceTimestamp: (new Date(activity.activeSince)).getTime(),
            activeSinceFormattedDate: formatDate(activity.activeSince, 'DD MMMM YYYY')
          })
        )
      )

      Promise.all([fieldsQuery, activitiesQuery])
      .then(next)
      .catch(next)
    })

    view.render('activities')
  },
})