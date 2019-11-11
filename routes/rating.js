'use strict'

const koaBody = require('koa-body')({multipart: true, includeUnparsed: true, uploadDir: '.'})
const Router = require('koa-router')

/* IMPORT CUSTOM MODULE */
const Article = require('../modules/article')
const User = require('../modules/user')
const Rating = require('../modules/rating')

const router = new Router({prefix: '/article'})

/**
 * The published article full-view page.
 *
 * @name Published Article
 * @route {GET} /:id
 */
router.get('/:id([0-9]{1,})', async ctx => {
	try {
		const article = await new Article(), user = await new User(), rating = await new Rating(),
			showHidden = await user.isAdmin(ctx.session.username),
			data = await article.get(ctx.params.id, showHidden)
		try {
			data.isAdmin = showHidden
			data.rating = await rating.get(ctx.session.userId, ctx.params.id)
			data.average = await rating.mean(ctx.params.id)
			data.loggedIn = ctx.session.authorised
			data.isAuthor = await article.byAuthor(ctx.session.userId, data.author_id)
		}catch(e) {
			data.isAuthor = false
		}
		return ctx.render('article/', data)
	}	catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

module.exports = router
