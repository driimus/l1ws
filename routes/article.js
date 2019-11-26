
'use strict'

const koaBody = require('koa-body')({multipart: true, includeUnparsed: true, uploadDir: '.'})
const Router = require('koa-router')

/* IMPORT CUSTOM MODULE */
const Article = require('../modules/article')

const {getAdmin, getUserInfo} = require('./helpers')

const router = new Router({prefix: '/article'})

/**
 * Redirect to article submission endpoint.
 *
 * @name New Article Shortcut
 * @route {GET} /article
 */
router.get('/', async ctx => ctx.redirect('/article/new'))

/**
 * The secure article submission page.
 *
 * @name New Article
 * @route {GET} /article/new
 * @authentication This route requires cookie-based authentication.
 */
router.get('/new', async ctx => {
	const data = await getUserInfo(ctx.session)
	try {
		if(data.loggedIn !== true) return ctx.redirect('/login?msg=you need to log in')
		if(ctx.query.msg) data.msg = ctx.query.msg
		await ctx.render('article/new', data)
	} catch(err) {
		data.message = err.message
		await ctx.render('error', data)
	}
})

/**
 * The secure article submission processor.
 *
 * @name New Article
 * @route {POST} /article/new
 * @authentication This route requires cookie-based authentication.
 */
router.post('/new', koaBody, async ctx => {
	const data = await getUserInfo(ctx.session)
	try {
		if(data.loggedIn !== true) return ctx.redirect('/login?msg=you need to log in')
		const {body: {headline, summary, content, thumbnail}} = ctx.request
		const article = await new Article()
		await article.add(ctx.session.userId, {headline, summary, content: JSON.parse(content), thumbnail})
		return ctx.redirect('/article/new?msg=your article was successfully added')
	} catch(err) {
		data.message = err.message
		await ctx.render('error', data)
	}
})

/**
 * The secure article image upload script.
 *
 * @name Upload Pictures
 * @route {POST} /article/upload
 * @authentication This route requires cookie-based authentication.
 */
router.post('/upload', koaBody, async ctx => {
	const data = await getUserInfo(ctx.session)
	try {
		if(data.loggedIn !== true) return ctx.redirect('/login?msg=you need to log in')
		const {thumbnail: {path, type}} = ctx.request.files
		const article = await new Article()
		const thumbnail = await article.uploadPicture({path, type})
		return ctx.body = {thumbnail}
	} catch(err) {
		data.message = err.message
		await ctx.render('error', data)
	}
})

/**
 * The secure article status update endpoint.
 *
 * @name Review Article
 * @route {POST} /article/:id
 * @authentication This route requires cookie-based authentication as admin.
 */
router.post('/:id([0-9]{1,})', koaBody, async ctx => {
	const data = await getUserInfo(ctx.session)
	try {
		if(data.loggedIn !== true) return ctx.redirect('/login?msg=you need to log in')
		// Check that requester is an admin.
		await getAdmin(ctx.session)
		// Update article submission status.
		const article = await new Article()
		await article.setStatus(ctx.params.id, ctx.request.body.status)
		return ctx.redirect(`/article/${ctx.params.id}`)
	}	catch(err) {
		data.message = err.message
		await ctx.render('error', data)
	}
})

/**
 * The secure article editing page.
 *
 * @name Published Article
 * @route {GET} /article/:id/edit
 * @authentication This route requires cookie-based authentication.
 */
router.get('/:id([0-9]{1,})/edit', async ctx => {
	let data = await getUserInfo(ctx.session)
	try {
		if(data.loggedIn !== true) return ctx.redirect('/login?msg=you need to log in')
		const article = await new Article(),
			res = await article.get(ctx.params.id, true)
		data = Object.assign(data, res)
		// Check that the author requested an edit.
		await article.byAuthor(ctx.session.userId, data.author_id)
		return ctx.render('article/new', data)
	}	catch(err) {
		data.message = err.message
		await ctx.render('error', data)
	}
})

/**
 * The secure edited article controller.
 *
 * @name Edit Article
 * @route {POST} /article/:id/edit
 * @authentication This route requires cookie-based authentication.
 */
router.post('/:id([0-9]{1,})/edit', koaBody, async ctx => {
	const data = await getUserInfo(ctx.session)
	try {
		if(data.loggedIn !== true) return ctx.redirect('/login?msg=you need to log in')
		const {headline, summary, content, thumbnail} = ctx.request.body
		const article = await new Article()
		await article.update(ctx.session.userId, ctx.params.id, {
			headline,
			summary,
			content: JSON.parse(content),
			thumbnail
		})
		return ctx.redirect('/?msg=your article was successfully edited')
	} catch(err) {
		data.message = err.message
		await ctx.render('error', data)
	}
})

module.exports = router
