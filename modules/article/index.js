
'use strict'

const db = require('../../db')

/** Class representing an article. */
class Article {

	/**
	 * Create a database connection and initialise a new table if needed.
	 */
	constructor() {
		return (async() => {
			this.db = new db()
			const sql = `CREATE TABLE IF NOT EXISTS article (
				id SERIAL PRIMARY KEY,
				author_id INTEGER,
				data JSON NOT NULL,
				created_at TIMESTAMPTZ DEFAULT now(),
				status TEXT DEFAULT 'pending'
					CHECK (status in ('pending','approved'))
			)`
			await this.db.query(sql)
			return this
		})()
	}

}

// Extend base class with custom functions.
require('./add')(Article)
require('./get')(Article)
require('./get-all')(Article)
require('./is-valid')(Article)
require('./upload-picture')(Article)

module.exports = Article
