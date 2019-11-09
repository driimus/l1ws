
'use strict'

const db = require('../../db')

// Barebones article schema.
const schema = `CREATE TABLE IF NOT EXISTS article (
	id SERIAL PRIMARY KEY,
	author_id INTEGER,
	data JSON NOT NULL,
	created_at TIMESTAMPTZ DEFAULT now())`,
	// Article schema upgrades.
	upgrade = `ALTER TABLE article
	ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending'
		CHECK (status in ('pending','approved','rejected'))`

/** Class representing an article. */
class Article {

	/**
	 * Create a database connection and initialise a new table if needed.
	 */
	constructor() {
		return (async() => {
			this.db = new db()
			await this.db.query(schema)
			await this.db.query(upgrade)
			return this
		})()
	}

}

// Extend base class with custom functions.
require('./add')(Article)
require('./get')(Article)
require('./get-all')(Article)
require('./get-status')(Article)
require('./set-status')(Article)
require('./is-valid')(Article)
require('./upload-picture')(Article)

module.exports = Article
