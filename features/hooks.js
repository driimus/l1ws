
'use strict'

const {AfterAll} = require('cucumber')
const scope = require('./support/scope')

AfterAll(async() => {
	if (scope.browser !== undefined) await scope.browser.close()
	// Stop the test server.
	scope.app.close(() => console.log('Shutting down server...'))
})
