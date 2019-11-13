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
		partials: {
			header: `${__dirname}/views/partials/header`,
			footer: `${__dirname}/views/partials/footer`,
			rating: `${__dirname}/views/partials/rating`
		}
	}
}))

const defaultPort = 8080
const port = process.env.PORT || defaultPort

const router = require('./routes')
app.use(router.routes())

/* Import custom modules for scheduled newsletter rollout. */
const User = require('./modules/user')
const Article = require('./modules/article')
const Newsletter = require('./modules/newsletter')
const newsletter = new Newsletter()

/**
 * Sends out a newsletter to all subscribed users at 8.a.m. every morning.
 * @async
 */
const sendNewsletter = async() => {
	try {
		const user = await new User(), article = await new Article(),
			recipients = await user.getMailingList(),
			articles = await article.getRecent()
		await newsletter.send(recipients, articles)
	} catch(err) {
		// Notify if there are no new articles or no recipients.
		console.log(`ERR: ${err.message}`)
	}
	// Wait until next occurrence of 8 a.m. to send next newsletter.
	const timeLeft = await newsletter.getTimeLeft(new Date(), 8)
	setTimeout(sendNewsletter, timeLeft)
}

module.exports = app.listen(port, async() => {
	// Initialize newsletter scheduler.
	await sendNewsletter()
	console.log(`listening on port ${port}`)
})
