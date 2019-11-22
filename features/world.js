
'use strict'

const {setWorldConstructor} = require('cucumber')
const puppeteer = require('puppeteer')

const scope = require('./support/scope')

const admin = {
	username: 'admin',
	password: 'secretpass',
	email: 'admin@admin.com'
}

process.env.ADMIN_USER = admin.username
process.env.ADMIN_PASS = admin.password
process.env.ADMIN_EMAIL = admin.email

const World = function() {
	scope.host = `http://localhost:${scope.port}`
	scope.driver = puppeteer
	scope.context = {
		accounts: [],
		admin
	}
}

setWorldConstructor(World)
