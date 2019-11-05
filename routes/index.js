
'use strict'

const Router = require('koa-router')
const router = new Router()

/* Import all the routes. */
router.use(require('./article').routes())
router.use(require('./user').routes())

/* IMPORT CUSTOM MODULE */
const Article = require('../modules/article')

/**
 * The home page where published articles are listed.
 *
 * @name Home Page
 * @route {GET} /
 * @authentication This route requires cookie-based authentication.
 */
router.get('/', async ctx => {
	try {
		// TO-DO: get articles
	  const article = await new Article()
		const articles = await article.getAll()
		await ctx.render('index', {articles})
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

module.exports = router
