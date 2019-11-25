
'use strict'

const {setWorldConstructor} = require('cucumber')
const puppeteer = require('puppeteer')

const scope = require('./support/scope')

const World = function() {
	scope.host = `http://localhost:${scope.port}`
	scope.driver = puppeteer
	scope.context = {
		accounts: [],
		admin: scope.admin
	}
}

setWorldConstructor(World)
