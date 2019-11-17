'use strict'

const koaBody = require('koa-body')({multipart: true, includeUnparsed: true, uploadDir: '.'})
const Router = require('koa-router')

/* IMPORT CUSTOM MODULE */
const Article = require('../modules/article')
const User = require('../modules/user')
const Rating = require('../modules/rating')

const getUserInfo = require('./helpers')

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
			showHidden = await user.isAdmin(ctx.session.username)
		let data = await article.get(ctx.params.id, showHidden)
		data = Object.assign(data, getUserInfo(ctx.session))
		try {
			data.isAdmin = showHidden
			data.rating = await rating.get(ctx.session.userId, ctx.params.id)
			data.average = await rating.mean(ctx.params.id)
			data.isAuthor = await article.byAuthor(ctx.session.userId, data.author_id)
		}catch(e) {
			data.isAuthor = false
		}
		return ctx.render('article/', data)
	}	catch(err) {
		const data = await getUserInfo(ctx.session)
		data.message = err.message
		await ctx.render('error', data)
	}
})

/**
 * The secure article rating update script.
 *
 * @name Rate Article
 * @route {POST} /:id/rate
 * @authentication This route requires cookie-based authentication.
 */
router.post('/:id([0-9]{1,})/rate', koaBody, async ctx => {
	try {
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
		const rating = await new Rating(),
			{value} = JSON.parse(ctx.request.body),
			_ = await rating.addOrUpdate(ctx.session.userId, ctx.params.id, value),
			newAverage = await rating.mean(ctx.params.id)
		return ctx.body = {newAverage, _}
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

module.exports = router
