
'use strict'

const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
const Router = require('koa-router')

/* IMPORT CUSTOM MODULE */
const Article = require('../modules/article')
const User = require('../modules/user')

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
		await ctx.render('article/new', data)
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

/**
 * The secure article submission processor.
 *
 * @name New Article
 * @route {POST} /new
 * @authentication This route requires cookie-based authentication.
 */
router.post('/new', koaBody, async ctx => {
	try {
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
		const {body: {headline, summary, content, thumbnail}} = ctx.request
		const uId = 1	// REPLACE WITH USER ID
		const article = await new Article()
		await article.add(uId, {headline, summary, content, thumbnail})
		return ctx.redirect('/article/new?msg=your article was successfully added')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

/**
 * The article image upload script.
 *
 * @name Upload Pictures
 * @route {POST} /upload
 */
router.post('/upload', koaBody, async ctx => {
	try {
		console.log(ctx.request.files)
		const {thumbnail: {path, type}} = ctx.request.files
		const article = await new Article()
		const thumbnail = await article.uploadPicture({path, type})
		return ctx.render('article/new', {thumbnail})
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

/**
 * The published article full-view page.
 *
 * @name Published Article
 * @route {GET} /:id
 */
router.get('/:id([0-9]{1,})', async ctx => {
	try {

	  const article = await new Article()
		const user = await new User()
		// Filter out hidden articles for non-admins.
		const showHidden = await user.isAdmin(ctx.session.username)
		const data = await article.get(ctx.params.id, showHidden)
		return ctx.render('article/', data)
	}	catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

/**
 * The secure article status update endpoint.
 *
 * @name Review Article
 * @route {POST} /:id
 * @authentication This route requires cookie-based authentication as admin.
 */
router.post('/:id([0-9]{1,})', koaBody, async ctx => {
	try {
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
		// Check that requester is an admin.
		const user = await new User()
		await user.getAdmin(ctx.session.username)
		// Update article submission status.
		const article = await new Article()
		await article.setStatus(ctx.params.id, ctx.request.body.status)
		return ctx.redirect(`/article/${ctx.params.id}`)
	}	catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

module.exports = router
