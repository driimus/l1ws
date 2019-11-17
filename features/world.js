
'use strict'

const {setWorldConstructor} = require('cucumber')
const puppeteer = require('puppeteer')

const scope = require('./support/scope')

// Run the server on a custom port.
const defaultPort = 8080
const port = process.env.PORT || defaultPort

const app = require('../')

const World = function() {
	scope.host = `http://localhost:${port}`
	scope.driver = puppeteer
	scope.context = {}
	scope.app = app.listen(port)
}

setWorldConstructor(World)
