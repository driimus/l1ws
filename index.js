#!/usr/bin/env node

'use strict'

/* MODULE IMPORTS */
const Koa = require('koa')
const views = require('koa-views')
const staticDir = require('koa-static')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')

const app = new Koa()

/* CONFIGURING THE MIDDLEWARE */
app.keys = ['darkSecret']
app.use(staticDir('public'))

/* Bootstrap the views. */
app.use(staticDir('node_modules/jquery/dist'))
app.use(staticDir('node_modules/bootstrap/dist/js'))
app.use(staticDir('node_modules/bootstrap/dist/css'))
app.use(staticDir('node_modules/@fortawesome'))

app.use(bodyParser())
app.use(session(app))
app.use(views(`${__dirname}/views`, {
	extension: 'handlebars', map: {handlebars: 'handlebars'},
	options: {
		helpers: {
			isText: (field, opts) => field.name === 'text' ? opts.fn(field) : opts.inverse(field),
			toUrl: (str) => str.indexOf('https') === 0 ? str : `/${str}`,
			ifRequired: (i, opts) => i === 0 ? opts.hash.label : ''
		},
		partials: {
			header: `${__dirname}/views/partials/header`,
			footer: `${__dirname}/views/partials/footer`,
			rating: `${__dirname}/views/partials/rating`,
			modal: `${__dirname}/views/partials/modal`,
			notification: `${__dirname}/views/partials/notification`
		}
	}
}))

const router = require('./routes')
app.use(router.routes())

module.exports = app
