
'use strict'

const Router = require('koa-router')
const router = new Router()

/* Import all the routes. */
router.use(require('./article').routes())
router.use(require('./user').routes())
router.use(require('./rating').routes())

/* Import custom modules. */
const Article = require('../modules/article')

const getUserInfo = require('./helpers')

/**
 * The home page where published articles are listed.
 *
 * @name Home Page
 * @route {GET} /
 */
router.get('/', async ctx => {
	const data = await getUserInfo(ctx.session)
	try {
		const article = await new Article()
		// Filter out hidden articles for non-admins.
		data.articles= await article.getAll(data.isAdmin)
		if(ctx.query.msg) data.msg = ctx.query.msg
		await ctx.render('index', data)
	} catch(err) {
		data.message = err.message
		await ctx.render('error', data)
	}
})

/**
 * The full-text search endpoint.
 *
 * @name Article Search
 * @route {POST} /search
 */
router.get('/search', async ctx => {
	const data = await getUserInfo(ctx.session)
	try {
		const article = await new Article()
		data.articles = await article.find(ctx.query.q, data.isAdmin)
		return ctx.render('search', data)
	} catch(err) {
		data.message = err.message
		await ctx.render('error', data)
	}
})

module.exports = router
