
'use strict'

const { Pool } = require('pg')

const config = require('./config.js')

/**
 * Class representing a pool of database connections.
 * @extends Pool
 */
class Database extends Pool {

	/**
   * Create a new Pool.
   * @param {string} [env=*Node environment*] - The database environment to be used.
   */
	constructor(env=process.env.NODE_ENV) {
		return super(config[env])
	}

}

module.exports = Database
