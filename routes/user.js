
'use strict'

const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
const Router = require('koa-router')

/* IMPORT CUSTOM MODULE */
const User = require('../modules/user')

const {getUserInfo} = require('./helpers')

const router = new Router()

/**
 * The user registration page.
 *
 * @name Register Page
 * @route {GET} /register
 */
router.get('/register', async ctx => {
	if(ctx.session.authorised === true) return ctx.redirect('/?msg=you\'re already logged in')
	await ctx.render('register')
})

/**
 * The script to process new user registrations.
 *
 * @name Register Script
 * @route {POST} /register
 */
router.post('/register', koaBody, async ctx => {
	try {
		// extract the data from the request
		const {body, files} = ctx.request.body
		// call the functions in the module
		const user = await new User()
		const userId = await user.register(body.user, body.pass, body.email)
		await user.setSubscription(userId, body.subscribed)
		if(files && files.avatar.size !== 0) {
			const {avatar} = ctx.request.files
			await user.setAvatar(body.user, avatar)
		}
		// redirect to the home page
		ctx.redirect(`/?msg=new user "${body.user}" added`)
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

router.get('/login', async ctx => {
	if(ctx.session.authorised === true) return ctx.redirect('/?msg=you\'re already logged in')
	const data = {}
	if(ctx.query.msg) data.msg = ctx.query.msg
	if(ctx.query.user) data.user = ctx.query.user
	await ctx.render('login', data)
})

router.post('/login', async ctx => {
	try {
		const body = ctx.request.body
		const user = await new User()
		ctx.session.userId = await user.login(body.user, body.pass)
		ctx.session.authorised = true
		ctx.session.username = body.user
		ctx.session.avatar = await user.getAvatar(ctx.session.userId)
		return ctx.redirect('/?msg=you are now logged in...')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

router.get('/account', async ctx => {
	const data = await getUserInfo(ctx.session)
	try {
		if(data.loggedIn !== true) return ctx.redirect('/login?msg=you need to log in')
		const user = await new User()
		data.email = await user.getEmail(ctx.session.userId)
		data.subscribed = await user.getSubscription(ctx.session.userId)
		if(ctx.query.msg) data.msg = ctx.query.msg
		if(ctx.query.user) data.user = ctx.query.user
		await ctx.render('account', data)
	} catch(err) {
		data.message = err.message
		await ctx.render('error', data)
	}
})

router.post('/account', koaBody, async ctx => {
	const data = await getUserInfo(ctx.session)
	try {
		if(data.loggedIn !== true) return ctx.redirect('/login?msg=you need to log in')
		const user = await new User()
		// extract the data from the request
		const { body: {email,subscribed}, files } = ctx.request
		await user.setEmail(ctx.session.userId, email)
		await user.setSubscription(ctx.session.userId, subscribed)
		if(files && files.avatar.size !== 0) {
			const {avatar} = ctx.request.files
			await user.setAvatar(data.username, avatar)
			ctx.session.avatar = await user.getAvatar(ctx.session.userId)
		}
		await ctx.redirect('/account?msg=your account details were updated')
	} catch(err) {
		data.message = err.message
		await ctx.render('error', data)
	}
})

router.get('/logout', async ctx => {
	ctx.session = null
	ctx.redirect('/?msg=you are now logged out')
})

module.exports = router
