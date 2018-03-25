/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
var _ = require('lodash');


/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/
exports.initLocals = function (req, res, next) {
	res.locals.navLinks = [
		{ label: 'Головна', key: 'home', href: '/' },
		{ label: 'Про нас', key: 'about', href: '/team', pages: [
			{ label: 'Команда', key: 'team', href: '/team' },
			{ label: 'Місія', key: 'mission', href: '/mission' },
			{ label: 'Презентації', key: 'presentations', href: '/presentations' },
			{ label: 'Партнери', key: 'partners', href: '/partners' },
			{ label: 'Відгуки', key: 'feedback', href: '/feedback' },
			{ label: 'FAQ', key: 'faq', href: '/faq' },
		]},
		{ label: 'Курси', key: 'courses', href: 'courses', pages: [
			{ label: 'Lego Mindstorm', key: 'course', href: '/course' },
		]},
		{ label: 'Новини', key: 'posts', href: '/posts'},
		{ label: 'Галерея', key: 'gallery', href: '/gallery'},
		{ label: 'Контакти', key: '', href: '#'},
	];
	res.locals.user = req.user;
	next();
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function (req, res, next) {
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error'),
	};
	res.locals.messages = _.some(flashMessages, function (msgs) { return msgs.length; }) ? flashMessages : false;
	next();
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}
};
