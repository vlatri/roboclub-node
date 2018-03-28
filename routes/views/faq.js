var keystone = require('keystone');

exports = module.exports = function (req, res) {

  var view = new keystone.View(req, res);

  // Render the view

  view.query('faqs',
    keystone.list('Faq').model
      .find().populate({
        path: 'sections', options: {
          sort: { sequenceNumber: 1 }
        }
      }).sort({sequenceNumber: 1}))
  view.render('faq');
};
