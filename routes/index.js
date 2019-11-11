
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

/**
 * The home page where published articles are listed.
 *
 * @name Home Page
 * @route {GET} /
 */
router.get('/', async ctx => {
	try {
	  const article = await new Article()
		const user = await new User()
		// Filter out hidden articles for non-admins.
		const showHidden = await user.isAdmin(ctx.session.username)
		const articles = await article.getAll(showHidden)
		await ctx.render('index', {articles, loggedIn: ctx.session.authorised})
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

module.exports = router
