
'use strict'

const {setWorldConstructor} = require('cucumber')
const puppeteer = require('puppeteer')

const scope = require('./support/scope')
// Import the running server.
const app = require('../')

const World = function() {
	scope.host = `http://localhost:${app.port}`
	scope.driver = puppeteer
	scope.context = {}
	scope.app = app
}

setWorldConstructor(World)
