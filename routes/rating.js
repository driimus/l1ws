'use strict'

const koaBody = require('koa-body')({multipart: true, includeUnparsed: true, uploadDir: '.'})
const Router = require('koa-router')

/* IMPORT CUSTOM MODULE */
const Article = require('../modules/article')
const Rating = require('../modules/rating')

const {getUserInfo, getAuthor} = require('./helpers')

const router = new Router({prefix: '/article'})

/**
 * The published article full-view page.
 *
 * @name Published Article
 * @route {GET} /:id
 */
router.get('/:id([0-9]{1,})', async ctx => {
	let data = await getUserInfo(ctx.session)
	try {
		const article = await new Article(), rating = await new Rating()
		const result = await article.get(ctx.params.id, data.isAdmin)
		data = Object.assign(data, result)
		try {
			data.rating = await rating.get(ctx.session.userId, ctx.params.id)
			data.average = await rating.mean(ctx.params.id)
			data.author = await getAuthor(data.author_id)
			data.isAuthor = await article.byAuthor(ctx.session.userId, data.author_id)
		}catch(e) {
			data.isAuthor = false
		}
		return ctx.render('article/', data)
	}	catch(err) {
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
