
'use strict'

const {BeforeAll, After, AfterAll} = require('cucumber')
const scope = require('./scope')
const snapshot = require('./snapshot')

const app = require('../../')
const db = require('../../db')
const User = require('../../modules/user')

const defaultPort = 8080

const makeAdmin = async account => {
	const user = await new User()
	await user.register(account.username, account.password, account.email)
	const sql = 'UPDATE users SET is_admin=true WHERE username=$1'
	await user.db.query(sql, [account.username])
}

BeforeAll(async() => {
	const pool = new db()
	await pool.query('ALTER ROLE petest SET search_path = public')
	scope.admin = {
		username: 'owner',
		password: 'secretpass',
		email: 'owner@admin.com'
	}
	scope.snapshotCount = 1
	// Run the server on a custom port.
	scope.port = process.env.PORT || defaultPort
	scope.app = app.listen(scope.port)
})

After({timeout: 20000}, async(scenario) => {
	const pool = new db()
	await pool.query('DROP TABLE IF EXISTS users,article,rating')
	await makeAdmin(scope.admin)

	// await snapshot(scenario.pickle.name)
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
