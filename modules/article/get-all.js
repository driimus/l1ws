
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
		if(articles.length === 0) throw new Error('found no published articles')
		return articles
	} catch(err) {
		throw err
	}
}

module.exports = Article => Article.prototype.getAll = getAll
