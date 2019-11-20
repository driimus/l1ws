
'use strict'

const {BeforeAll, AfterAll} = require('cucumber')
const scope = require('./support/scope')

const db = require('../db')

BeforeAll(async() => {
	const pool = new db()
	await pool.query('ALTER ROLE petest SET search_path = public')
})

AfterAll(async() => {
	const pool = new db()
	await pool.query('ALTER ROLE petest SET search_path = pg_temp')
	if (scope.browser !== undefined) await scope.browser.close()
	// Stop the test server.
	scope.app.close(() => console.log('Shutting down server...'))
})
