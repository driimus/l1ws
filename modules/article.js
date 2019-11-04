
'use strict'

const db = require('../db')

module.exports = class Article {

	constructor() {
		return (async() => {
			this.db = new db()
			const sql = `CREATE TABLE IF NOT EXISTS article (
				id SERIAL PRIMARY KEY,
				author_id INTEGER,
				data JSON NOT NULL
			)`
			await this.db.query(sql)
			return this
		})()
	}

	async add(userId, article) {
		const sql = 'INSERT INTO article(author_id, data) VALUES($1, $2)'
		await this.db.query(sql, [userId, JSON.stringify(article)])
		return true
	}

}
