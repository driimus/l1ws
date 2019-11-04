
'use strict'

const { Pool } = require('pg')

const config = require('./config.js')

module.exports = class Database extends Pool {

	constructor(env=process.env.NODE_ENV) {
		return super(config[env])
	}

}
