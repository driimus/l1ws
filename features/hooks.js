
'use strict'

const {BeforeAll, After, AfterAll} = require('cucumber')
const scope = require('./support/scope')

const app = require('../')
const db = require('../db')

const defaultPort = 8080

BeforeAll(async() => {
	const pool = new db()
	await pool.query('ALTER ROLE petest SET search_path = public')

	// Run the server on a custom port.
	scope.port = process.env.PORT || defaultPort
	scope.app = app.listen(scope.port)
})

After(async() => {
	const pool = new db(), dbname = pool.options.database
	// await pool.query('TRUNCATE TABLE users')

	let session = scope.context.currentPage
	// Exit if there is no session.
	if (scope.browser === undefined || session === undefined) return
	const cookies = await session.cookies()
	// Clear app cookies to reset koa session.
	if (cookies !== undefined && cookies.length !== 0)
		await session.deleteCookie(...cookies)
	await session.close()
	session = null
})

AfterAll(async() => {
	const pool = new db()
	await pool.query('ALTER ROLE petest SET search_path = pg_temp')
	if (scope.browser !== undefined) await scope.browser.close()
	// Stop the test server.
	scope.app.close(() => console.log('Shutting down server...'))
})
