
'use strict'

const db = require('../db/db.js')

module.exports = class Article {

	constructor() {
		return (async() => {
			const sql = `CREATE TABLE IF NOT EXISTS article (
				id SERIAL PRIMARY KEY,
				author_id INTEGER,
				data JSON NOT NULL
			)`
			await db.query(sql)
			return this
		})()
	}

	async add(title, summary, content) {
		throw new Error('missing function implementation')
	}

}
