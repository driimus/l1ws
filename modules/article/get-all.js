
'use strict'

/**
 * Retrieves all the articles in reverse chronological order.
 *
 * @param {boolean} showHidden - Flag for filtering articles by status.
 * @async
 * @returns {Array} List of the published articles as objects.
 */
const getAll = async function(showHidden=false) {
	try {
		// TO-DO: implement pagination
		const sql = `SELECT * FROM article ${showHidden === false ? 'WHERE status=\'approved\'' : ''} ORDER BY created_at DESC`
		const {rows: articles} = await this.db.query(sql)
		if(articles.length === 0) throw new Error('found no published articles')
		return articles
	} catch(err) {
		throw err
	}
}

module.exports = Article => Article.prototype.getAll = getAll
