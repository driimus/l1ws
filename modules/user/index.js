
'use strict'

const db = require('../../db')

/** Class representing an user. */
class User {

	/**
	 * Create a database connection and initialise a new table if needed.
	 */
	constructor() {
		return (async() => {
			this.db = new db()
			const sql = `CREATE TABLE IF NOT EXISTS users (
				id SERIAL PRIMARY KEY,
				username TEXT NOT NULL,
				password TEXT NOT NULL
			)`
			await this.db.query(sql)
			return this
		})()
	}

}

// Extend base class with custom functions.
require('./register')(User)
require('./login')(User)
require('./upload-picture')(User)

module.exports = User
