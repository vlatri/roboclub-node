/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

import keystone from 'keystone'
const middleware = require('./middleware')
const requireDir = require('webpack-requiredir')


const views = keystone.get('env') === 'production' ?
  requireDir(require.context('./views', true, /\.js$/)) :
  keystone.importer(__dirname)('./views')


// Common Middleware
keystone.pre('routes', middleware.initLocals)
keystone.pre('render', middleware.flashMessages)

// Import Route Controllers
const routes = { views }

const { activities } = routes.views

// Setup Route Bindings
exports = module.exports = app => {
  // Views
  app.get('/',              routes.views.home)

  app.get('/team',          routes.views.team)
  app.get('/partners',      routes.views.partners)
  app.get('/feedback',      routes.views.feedback)
  app.get('/faq',           routes.views.faq)
  app.get('/posts',         routes.views.posts)
  app.get('/post/:item',    routes.views.post)
  app.get('/courses',       activities.courses.multi)
  app.get('/course/:item',  activities.courses.single)
  app.get('/camps',         activities.camps.multi)
  app.get('/camp/:item',    activities.camps.single)
  app.get('/events',        activities.events.multi)
  app.get('/event/:item',   activities.events.single)
  app.get('/projects',      activities.events.multi)
  app.get('/project/:item', activities.events.single)
  app.get('/albums',        routes.views.albums)
  app.get('/album/:item',   routes.views.album)
  app.post('/contact',      routes.views.contact)

  app.get('/500', routes.views.errors[500])
  app.all('*',    routes.views.errors[404])


  // NOTE: To protect a route so that only admins can see it, use the requireUser middleware:

  // app.get('/protected', middleware.requireUser, routes.views.protected)

}
