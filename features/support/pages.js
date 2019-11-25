
'use strict'

const pages = {
	home: '/',
	search: '/search',
	login: '/login',
	logout: '/logout',
	signup: '/register',
	'account details': '/account',
	'new article': '/article/new',
	article: id => `/article/${id}`
}

module.exports = pages
