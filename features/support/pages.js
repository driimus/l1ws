
'use strict'

const pages = {
	home: '/',
	login: '/login',
	logout: '/logout',
	signup: '/register',
	'account details': '/account',
	'new article': '/article/new',
	article: id => `/article/${id}`
}

module.exports = pages
