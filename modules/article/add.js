
'use strict'

const isValid = async(article) => {
	try {
		const required = ['headline', 'summary', 'thumbnail', 'content']
		required.forEach(section => {
			if(!article.hasOwnProperty(section) || article[section].length === 0)
				throw new Error(`missing article ${section}`)
		})
		return true
	} catch(err) {
		throw err
	}
}

const add = async function(userId, article) {
	try {
		await isValid(article)
		if(userId === undefined) throw new Error(`missing user ID ${userId}`)
		const sql = 'INSERT INTO article(author_id, data) VALUES($1, $2)'
		await this.db.query(sql, [userId, article])
		return true
	} catch(err) {
		throw err
	}
}

module.exports = Article => Article.prototype.add = add
