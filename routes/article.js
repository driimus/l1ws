
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
		const data = {loggedIn: ctx.session.authorised}
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
		const uId = ctx.session.userId
		const article = await new Article()
		await article.add(uId, {headline, summary, content, thumbnail})
		return ctx.redirect('/article/new?msg=your article was successfully added', {loggedIn: true})
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

/**
 * The secure article image upload script.
 *
 * @name Upload Pictures
 * @route {POST} /upload
 * @authentication This route requires cookie-based authentication.
 */
router.post('/upload', koaBody, async ctx => {
	try {
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
		const {thumbnail: {path, type}} = ctx.request.files
		const article = await new Article()
		const thumbnail = await article.uploadPicture({path, type})
		return ctx.render('article/new', {thumbnail, loggedIn: true})
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
		try {
			data.isAuthor = await article.byAuthor(ctx.session.userId, data.author_id)
		}catch(e) {
			data.isAuthor = false
		}
		data.isAdmin = showHidden
		data.loggedIn = ctx.session.authorised
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

/**
 * The secure article editing page.
 *
 * @name Published Article
 * @route {GET} /:id/edit
 * @authentication This route requires cookie-based authentication.
 */
router.get('/:id([0-9]{1,})/edit', async ctx => {
	try {
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
		const article = await new Article()
		const data = await article.get(ctx.params.id, true)
		// Check that the author requested an edit.
		await article.byAuthor(ctx.session.userId, data.author_id)
		data.loggedIn = ctx.session.authorised
		return ctx.render('article/new', data)
	}	catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

/**
 * The secure edited article controller.
 *
 * @name Edit Article
 * @route {POST} /:id/edit
 * @authentication This route requires cookie-based authentication.
 */
router.post('/:id([0-9]{1,})/edit', koaBody, async ctx => {
	try {
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
		const { body: {headline, summary, content, thumbnail} } = ctx.request
		const article = await new Article()
		await article.update(ctx.session.userId, ctx.params.id, {headline, summary, content, thumbnail})
		return ctx.redirect(`/article/${ctx.params.id}?msg=your article was successfully edited`)
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

module.exports = router
