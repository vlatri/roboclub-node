// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').config()

// Require keystone
var keystone = require('keystone')

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({
  'name': 'RoboClubIF',
  'brand': 'RoboClubIF',

  'sass': 'public',
  'static': 'public',
  'favicon': 'public/favicon.ico',
  'views': 'templates/views',
  'view engine': 'pug',

  'mongo': process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/roboclubif',
  'port': process.env.PORT || 3000,
  'session store': 'mongo',

  'wysiwyg images': true,
  'wysiwyg additional buttons': 'searchreplace visualchars,'
    + ' charmap ltr rtl pagebreak paste, forecolor backcolor,'
    +' preview print',
  'wysiwyg additional plugins': 'example, table, advlist, anchor,'
    + ' autolink, autosave, charmap, contextmenu,'
    + ' directionality, hr, pagebreak,'
    + ' paste, preview, searchreplace, textcolor,'
    + ' visualblocks, visualchars, wordcount',
  'wysiwyg additional options': {
    paste_as_text: true,
    textcolor_map: [
      "000000", "Black",
      "FFFFFF", "White",
      "ECECEC", "Gray",
      "F89F4F", "Orange",
      "D86761", "Red",
      "00A5B6", "Blue",
    ]
  },
  'auto update': false,
  'session': true,
  'auth': true,

  'user model': 'User',
})


console.log(`Running app in ${keystone.get('env')} environment`)

// Load your project's Models
if(keystone.get('env') === 'production') {
  const context = require.context('./models', true, /\.js$/)
  context.keys().forEach(context)
} else keystone.import('models')


// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js

const defaultLocals = {
  env: keystone.get('env'),
  editable: keystone.content.editable,
  utils: keystone.utils,
}

const setLocals = locals => keystone.set('locals', locals)

keystone.list('Common').model.findOne({}, {_id: false}).exec()
.then(layout => setLocals({ ...defaultLocals, commonLayout: layout }))
.catch(() => setLocals(defaultLocals))

// Load your project's Routes
keystone.set('routes', require('./routes'))


// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
  common: 'commons',
  home: ['layouts', 'quotes'],
  about: ['participants', 'missions', 'donations', 'presentations', 'partners'],
  faq: ['faqs', 'faqsections'],
  posts: ['posts', 'postsections'],
  courses: ['courses', 'coursefields', 'coursesections'],
  albums: ['albums', 'albumitems'],
  enquiries: 'enquiries',
  users: 'users',
})


keystone.start()
