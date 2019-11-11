
'use strict'

/**
 * Retrieves a summary of the articles published over the last 24 hours.
 *
 * @async
 *
 * @returns {object[]} List of the latest publications' summaries as objects.
 */
const getRecent = async function() {
	const sql = 'SELECT data FROM article'
	const {rows: articles} = await this.db.query(sql)
	return articles.map(article => article.data)
}

module.exports = Article => Article.prototype.getRecent = getRecent
