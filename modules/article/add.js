
'use strict'

/**
 * Saves a new article submission.
 * @memberof Article.prototype
 *
 * @async
 * @param {number} userId - The ID of the article's author.
 * @param {object} article - The article object submitted.
 * @returns {boolean} If the process was successful.
 */
const add = async function(userId, article) {
	try {
		// Validate article to be submitted first.
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
