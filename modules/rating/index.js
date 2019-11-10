
'use strict'

const db = require('../../db')

// Barebones rating schema.
const schema = `CREATE TABLE IF NOT EXISTS rating (
	id SERIAL PRIMARY KEY,
	author_id INTEGER,
	article_id INTEGER,
	value INTEGER CHECK (value BETWEEN 1 AND 5),
	CONSTRAINT unique_rating UNIQUE(author_id, article_id)
)`

/** Class representing an individual rating. */
class Rating {

	/**
	 * Create a database connection and initialise a new table if needed.
	 */
	constructor() {
		return (async() => {
			this.db = new db()
			await this.db.query(schema)
			return this
		})()
	}

}

// Extend base class with custom functions.
require('./add-or-update')(Rating)

module.exports = Rating
