
'use strict'

/**
 * Retrieves all the stored articles in reverse chronological order.
 *
 * @async
 */
const getAll = async function() {
	try {
		// TO-DO: implement pagination
		const sql = 'SELECT * FROM article ORDER BY created_at DESC'
		const {rows: articles} = await this.db.query(sql)
		return articles
	} catch(err) {
		throw err
	}
}

module.exports = Article => Article.prototype.getAll = getAll
