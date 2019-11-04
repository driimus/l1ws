
'use strict'

const add = async function(userId, article) {
	try {
		await this.isValid(article)
		if(userId === undefined) throw new Error(`missing user ID ${userId}`)
		const sql = 'INSERT INTO article(author_id, data) VALUES($1, $2)'
		await this.db.query(sql, [userId, article])
		return true
	} catch(err) {
		throw err
	}
}

module.exports = Article => Article.prototype.add = add
