
'use strict'

const {setWorldConstructor} = require('cucumber')
const puppeteer = require('puppeteer')

const scope = require('./support/scope')

// Run the server on a custom port.
process.env.PORT = 3000
const app = require('../')

const World = function() {
	scope.host = `http://localhost:${process.env.PORT}`
	scope.driver = puppeteer
	scope.context = {}
	scope.app = app
}

setWorldConstructor(World)
