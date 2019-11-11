
'use strict'

/**
 * Retrieves all the articles in reverse chronological order.
 *
 * @param {boolean} showHidden - Flag for filtering articles by status.
 * @async
 * @returns {Array} List of the requested articles as objects.
 */
const getRecent = async function(showHidden=false) {
	const sql = 'SELECT data FROM article'
	const {rows: articles} = await this.db.query(sql)
	return articles.map(article => article.data)
}

module.exports = Article => Article.prototype.getRecent = getRecent
