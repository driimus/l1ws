
'use strict'

const Router = require('koa-router')
const router = new Router()

/* Import all the routes. */
router.use(require('./article').routes())
router.use(require('./user').routes())
router.use(require('./rating').routes())

/* Import custom modules. */
const Article = require('../modules/article')
const User = require('../modules/user')

const getUserInfo = require('./helpers')

/**
 * The home page where published articles are listed.
 *
 * @name Home Page
 * @route {GET} /
 */
router.get('/', async ctx => {
	try {
	  const article = await new Article(), user = await new User()
		const data = await getUserInfo(ctx.session)
		// Filter out hidden articles for non-admins.
		const showHidden = await user.isAdmin(data.username)
		data.articles= await article.getAll(showHidden)
		if(ctx.query.msg) data.msg = ctx.query.msg
		await ctx.render('index', data)
	} catch(err) {
		const data = await getUserInfo(ctx.session)
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
	try {
		const article = await new Article(), user = await new User(),
			showHidden = await user.isAdmin(ctx.session.username)
		const articles = await article.find(ctx.query.q, showHidden)
		return ctx.render('search', {articles, loggedIn: ctx.session.authorised})
	} catch(err) {
		const data = await getUserInfo(ctx.session)
		data.message = err.message
		await ctx.render('error', data)
	}
})

module.exports = router
