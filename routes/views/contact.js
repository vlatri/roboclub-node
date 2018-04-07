var keystone = require('keystone')
const Enquiry = keystone.list('Enquiry')

exports = module.exports = (req, res) => {

  const view = new keystone.View(req, res)
  const { locals } = res

  // Set locals
  locals.section = 'contact'

  const { name, phone, email, subject, message } = req.body

  Enquiry.model
  .create({ name, phone, email, subject, message })
  .then(() => view.render('contact'))
  .catch(err => console.log(err)) // Some kind of a handler
}
