import keystone from 'keystone'


exports = module.exports = (req, res) => {
  const view = new keystone.View(req, res)
  const { locals } = res

  locals.title = 'Відгуки'
  locals.section = 'about'

  view.render('feedback')
};
