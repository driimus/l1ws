
'use strict'

const {setWorldConstructor} = require('cucumber')
const puppeteer = require('puppeteer')

const scope = require('./support/scope')

// Run the server on a custom port.
const defaultPort = 8080
const port = process.env.PORT || defaultPort

const admin = {
	username: 'admin',
	password: 'secretpass',
	email: 'admin@admin.com'
}

process.env.ADMIN_USER = admin.username
process.env.ADMIN_PASS = admin.password
process.env.ADMIN_EMAIL = admin.email

const app = require('../')

const World = function() {
	scope.host = `http://localhost:${port}`
	scope.driver = puppeteer
	scope.context = {
		accounts: [],
		admin
	}
	scope.app = app.listen(port)
}

setWorldConstructor(World)
