
'use strict'

const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
const Router = require('koa-router')

/* IMPORT CUSTOM MODULE */
const Article = require('../modules/article')

const router = new Router({prefix: '/article'})

/**
 * Redirect to article submission endpoint.
 *
 * @name New Article Shortcut
 * @route {GET} /
 */
router.get('/', async ctx => ctx.redirect('/article/new'))

/**
 * The secure article submission page.
 *
 * @name New Article
 * @route {GET} /new
 * @authentication This route requires cookie-based authentication.
 */
router.get('/new', async ctx => {
	try {
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
		const data = {}
		if(ctx.query.msg) data.msg = ctx.query.msg
		await ctx.render('article', data)
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

module.exports = router
