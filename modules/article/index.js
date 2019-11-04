
'use strict'

const db = require('../../db')

class Article {

	constructor() {
		return (async() => {
			this.db = new db()
			const sql = `CREATE TABLE IF NOT EXISTS article (
				id SERIAL PRIMARY KEY,
				author_id INTEGER,
				data JSON NOT NULL,
				created_at TIMESTAMPTZ DEFAULT now()
			)`
			await this.db.query(sql)
			return this
		})()
	}

}

// Extend base class with custom functions.
require('./add')(Article)
require('./get-all')(Article)
require('./is-valid')(Article)
require('./upload-picture')(Article)

module.exports = Article
