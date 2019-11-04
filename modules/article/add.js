
'use strict'

const add = async function(userId, article) {
	const sql = 'INSERT INTO article(author_id, data) VALUES($1, $2)'
	await this.db.query(sql, [userId, JSON.stringify(article)])
	return true
}

module.exports = Article => Article.prototype.add = add
