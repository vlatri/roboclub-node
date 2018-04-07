import keystone from 'keystone'


exports = module.exports = (req, res) => {
  const view = new keystone.View(req, res)
  const { locals } = res

  locals.title = 'FAQ'
  locals.sections = 'about'

  view.query('faqs',
    keystone.list('Faq').model
    .find()
    .populate({
      path: 'sections', options: {
        sort: { sequenceNumber: 1 }
      }
    })
    .sort({sequenceNumber: 1})
  )
  view.render('faq')
}
